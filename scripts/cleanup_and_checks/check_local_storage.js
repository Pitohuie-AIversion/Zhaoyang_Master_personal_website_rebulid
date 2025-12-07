// 在浏览器控制台中运行的代码，用于检查本地备份
(function() {
  const localBackup = localStorage.getItem('contactMessages_backup');
  const submissionHistory = localStorage.getItem('contactSubmissions');
  
  console.log('=== 本地备份数据 ===');
  if (localBackup) {
    try {
      const backupData = JSON.parse(localBackup);
      console.log('联系消息备份:', backupData);
    } catch (e) {
      console.log('备份数据解析失败:', e);
    }
  } else {
    console.log('没有本地备份数据');
  }
  
  console.log('=== 提交历史 ===');
  if (submissionHistory) {
    try {
      const historyData = JSON.parse(submissionHistory);
      console.log('提交历史:', historyData);
    } catch (e) {
      console.log('历史数据解析失败:', e);
    }
  } else {
    console.log('没有提交历史');
  }
  
  console.log('=== 当前本地存储 ===');
  console.log('所有本地存储键:', Object.keys(localStorage));
})();