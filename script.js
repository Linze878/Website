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
  
    // **避免圖表重複疊加**，僅刪除 <canvas> 元素，而不刪除整個 chart 區域
    let chartContainer = document.getElementById("charts");
    let categoryCanvas = document.getElementById("categoryChart");
    let dailyCanvas = document.getElementById("dailyChart");
  
    // 只清除現有的 canvas 元素
    if (categoryCanvas) categoryCanvas.remove();
    if (dailyCanvas) dailyCanvas.remove();
  
    // 如果有數據，顯示圖表
    if (Object.keys(categoryData).length > 0 || Object.keys(dailyData).length > 0) {
      chartContainer.innerHTML += `<canvas id="categoryChart"></canvas><canvas id="dailyChart"></canvas>`;
  
      // 創建圓餅圖 (花費種類分析)
      new Chart(document.getElementById("categoryChart"), {
        type: "pie",
        data: {
          labels: Object.keys(categoryData),
          datasets: [{
            data: Object.values(categoryData),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
          }]
        }
      });
  
      // 創建長條圖 (每日支出一覽) 並加上趨勢線
      new Chart(document.getElementById("dailyChart"), {
        type: "bar",
        data: {
          labels: Object.keys(dailyData),
          datasets: [
            {
              label: "支出趨勢線",
              data: Object.values(dailyData),
              type: 'line', // 顯示為折線圖
              borderColor: 'red', // 趨勢線顏色
              fill: false, // 不填充折線下方的區域
              tension: 0, // 控制折線的平滑度
              borderWidth: 2, // 調整趨勢線的粗細
              pointStyle: 'circle', // 圓點樣式
              pointRadius: 3, // 圓點大小
              pointBackgroundColor: 'red', // 圓點顏色
              pointBorderColor: 'red', // 圓點邊框顏色
              pointBorderWidth: 1 // 圓點邊框寬度
            },
            {
              label: "每日支出",
              data: Object.values(dailyData),
              backgroundColor: "#36a2eb", // 長條圖顏色
              barThickness: 25 // 設置長條圖的寬度，使長條變窄
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                boxWidth: 20,  // 調整圖例框的寬度
                usePointStyle: true, // 使用圓形圖例
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '日期'
              }
            },
            y: {
              title: {
                display: true,
                text: '金額'
              }
            }
          }
        }
      });
    }
  }
  