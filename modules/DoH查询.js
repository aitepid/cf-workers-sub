	if (现缓存项 && 当前时间戳 < 现缓存项.过期时间) {
		return 现缓存项.data.map(data => ({ type: qtype, data }));
		return 现缓存项.data.map(data => ({ type: qtype, data }));
	}