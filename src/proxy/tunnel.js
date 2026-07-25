/**
 * Bidirectional tunnel — pipes data between two streams in both directions
 */

/**
 * Pipe data from source to destination stream
 * @param {ReadableStream} source - Source stream (e.g., WebSocket readable)
 * @param {WritableStream} destination - Destination stream (e.g., TCP writable)
 */
async function pipeStream(source, destination) {
    try {
        const reader = source.getReader();
        const writer = destination.getWriter();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
        }
        
        await writer.close();
    } catch (error) {
        console.error('[Pipe Error]:', error.message);
    }
}

/**
 * Create a bidirectional pipe between two streams
 * @param {ReadableStream|WebSocket} streamA - First stream (client side)
 * @param {ReadableStream|WebSocket} streamB - Second stream (remote side)
 */
export async function pipeStreams(streamA, streamB) {
    // If streamA is a WebSocket, convert to readable/writable pairs
    let aReadable, aWritable;
    let bReadable, bWritable;
    
    if (streamA && typeof streamA.pipeThrough === 'function') {
        [aReadable, aWritable] = splitStream(streamA);
    } else if (streamA && streamA.readable) {
        aReadable = streamA.readable;
        aWritable = streamA.writable;
    }
    
    if (streamB && streamB.readable) {
        bReadable = streamB.readable;
        bWritable = streamB.writable;
    }
    
    // Start both directions simultaneously
    const forwardPromise = pipeStream(aReadable, bWritable);
    const reversePromise = pipeStream(bReadable, aWritable);
    
    await Promise.all([forwardPromise, reversePromise]);
}
