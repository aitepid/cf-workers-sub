"""
Split a large Cloudflare Worker script into modular files.

Usage: python split_worker.py [input.js] [output_dir]
"""
import sys, re, os

def extract_bracket_block(lines, start_line):
    """Extract code block starting at start_line until balanced closing brace."""
    depth = 0
    in_string = None
    i = start_line - 1  # 0-indexed
    func_lines = []
    
    while i < len(lines) and depth >= 0:
        line = lines[i]
        
        # Track string state to avoid counting braces in strings/comments
        j = 0
        while j < len(line):
            c = line[j]
            
            # Skip commented-out code (simple heuristic)
            if in_string is None:
                if c == '/' and j + 1 < len(line) and line[j+1] == '/':
                    break
                elif c == '/' and j + 1 < len(line) and line[j+1] == '*':
                    # Multi-line comment - skip to */
                    end_idx = line.find('*/', j + 2)
                    if end_idx != -1:
                        j = end_idx + 1
                    else:
                        break
            
            if in_string is None:
                if c in ('"', "'", '`'):
                    in_string = c
                    if c != '`':  # Template literals can span lines
                        j += 1
                        continue
                elif c == '{':
                    depth += 1
                    func_lines.append((i + 1, line))
                elif c == '}':
                    depth -= 1
                    func_lines.append((i + 1, line))
                    
                    if depth == 0:
                        return func_lines, i + 1
            elif c == in_string:
                in_string = None
            
            j += 1
        
        i += 1
    
    return func_lines, min(i, len(lines))


def main():
    input_path = sys.argv[1] if len(sys.argv) > 1 else 'worker_original.js'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'modules'
    
    with open(input_path) as f:
        content = f.read()
    lines = content.split('\n')
    
    # Define key functions and their starting lines
    functions = {
        '处理XHTTP请求': 667,
        '处理gRPC请求': 989,
        '处理WS请求': 1291,
        'socks5Connect': 2761,
        'httpConnect': 2797,
        'httpsConnect': 2855,
        'turnConnect': 3763,
        'sstpConnect': 3950,
        'MD5MD5': 5011,
        'DoH查询': 5053,
        '读取config_JSON': 5234,
        '生成随机IP': 5518,
        '整理成数组': 5551,
        '请求优选API': 5610,
        '反代参数获取': 5814,
        'getCloudflareUsage': 5989,
        'html1101': 6195,
    }
    
    print(f"Processing {len(lines)} lines from {input_path}...")
    print(f"Found {len(functions)} target functions.\n")
    
    extracted = {}
    for name, line_num in functions.items():
        block, end_line = extract_bracket_block(lines, line_num)
        size = sum(len(l) for _, l in block)
        extracted[name] = {
            'start': line_num,
            'end': end_line,
            'lines': len(block),
            'size': size,
            'code': '\n'.join(code for _, code in block)
        }
        print(f"  {name}: lines {line_num}-{end_line} ({len(block)} lines, {size:,} chars)")
    
    print(f"\nTotal extracted: {sum(e['lines'] for e in extracted.values()):,} lines")
    
    # Save extracted code blocks
    os.makedirs(output_dir, exist_ok=True)
    for name, info in extracted.items():
        # Sanitize filename
        safe_name = ''.join(c if c.isalnum() or c == '_' else '_' for c in name)
        filepath = os.path.join(output_dir, f"{safe_name}.js")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(info['code'])
        print(f"Saved {safe_name}.js ({info['size']:,} bytes)")


if __name__ == '__main__':
    main()
