document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
  
    const recordList = document.getElementById("record-list");
    const newRecord = document.createElement("li");
    newRecord.textContent = `${date} - ${category}: $${amount}`;
    recordList.appendChild(newRecord);
  
    // 清空表單
    document.getElementById("amount").value = '';
    document.getElementById("category").value = '';
    document.getElementById("date").value = '';
  });  