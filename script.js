document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
  
    if (!amount || !category || !date) {
      alert("請填寫所有欄位！");
      return;
    }
  
    addRecordToList({ date, category, amount });
  
    saveRecord({ date, category, amount }); // 存到 Local Storage
  
    // 清空表單
    document.getElementById("amount").value = '';
    document.getElementById("category").value = '';
    document.getElementById("date").value = '';
  });
  
  // **函式：新增紀錄到列表**
  function addRecordToList(record) {
    const recordList = document.getElementById("record-list");
    const newRecord = document.createElement("li");
    newRecord.innerHTML = `${record.date} - ${record.category}: $${record.amount} 
      <button class="delete-btn">刪除</button>`;
  
    recordList.appendChild(newRecord);
  
    // **監聽刪除按鈕點擊事件**
    newRecord.querySelector(".delete-btn").addEventListener("click", function () {
      recordList.removeChild(newRecord);
      removeRecordFromStorage(record); // 從 Local Storage 移除
    });
  }
  function saveRecord(record) {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));
  }
  
  // **函式：從 Local Storage 移除記錄**
  function removeRecordFromStorage(recordToRemove) {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records = records.filter(record => 
      record.date !== recordToRemove.date || 
      record.category !== recordToRemove.category || 
      record.amount !== recordToRemove.amount
    );
    localStorage.setItem("records", JSON.stringify(records));
  }
  // **自動載入記帳紀錄**
  window.addEventListener("load", function () {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.forEach(record => addRecordToList(record));
  });
    