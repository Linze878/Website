document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
  
    if (!amount || !category || !date) {
      alert("請填寫所有欄位！");
      return;
    }
  
    const record = { date, category, amount };
    addRecordToList(record);
    saveRecord(record);  
    document.getElementById("amount").value = '';
    document.getElementById("category").value = '';
    document.getElementById("date").value = '';
  
    generateCharts(); // 更新圖表
  });
  
  // **函式：新增記錄到列表**
  function addRecordToList(record) {
    const recordList = document.getElementById("record-list");
    const newRecord = document.createElement("li");
    newRecord.innerHTML = `${record.date} - ${record.category}: $${record.amount} 
      <button class="delete-btn">刪除</button>`;
      
    recordList.appendChild(newRecord);

    newRecord.querySelector(".delete-btn").addEventListener("click", function () {
      recordList.removeChild(newRecord);
      removeRecordFromStorage(record);
      generateCharts(); // 更新圖表
    });
  }
  
  // **函式：儲存記錄到 Local Storage**
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
  
  // **函式：清空所有紀錄**
  document.getElementById("clearAll").addEventListener("click", function () {
    localStorage.removeItem("records");
    document.getElementById("record-list").innerHTML = "";
    generateCharts(); // 更新圖表
  });
  
  // **頁面載入時載入記錄**
  window.addEventListener("load", function () {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.forEach(record => addRecordToList(record));
    generateCharts();
  });
  
  // **函式：產生圖表**
  function generateCharts() {
    let records = JSON.parse(localStorage.getItem("records")) || [];
  
    let categoryData = {};
    let dailyData = {};
  
    records.forEach(record => {
      categoryData[record.category] = (categoryData[record.category] || 0) + parseFloat(record.amount);
      dailyData[record.date] = (dailyData[record.date] || 0) + parseFloat(record.amount);
    });
  
    // **避免圖表重複疊加**
    document.getElementById("categoryChart").remove();
    document.getElementById("dailyChart").remove();
    let chartContainer = document.getElementById("charts");
    chartContainer.innerHTML = `<canvas id="categoryChart"></canvas><canvas id="dailyChart"></canvas>`;
  
    new Chart(document.getElementById("categoryChart"), {
      type: "pie",
      data: {
        labels: Object.keys(categoryData),
        datasets: [{ data: Object.values(categoryData), backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"] }]
      }
    });
  
    new Chart(document.getElementById("dailyChart"), {
      type: "bar",
      data: {
        labels: Object.keys(dailyData),
        datasets: [{ label: "每日支出", data: Object.values(dailyData), backgroundColor: "#36a2eb" }]
      }
    });
  }
  