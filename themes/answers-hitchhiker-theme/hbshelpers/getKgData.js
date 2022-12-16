
module.exports = async function getKgData() {
  const response = await getApiData();  
  console.log('response',response);
  return response;
}

function getApiData() {  
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  
        var xhr = new XMLHttpRequest();      
        var url = 'https://jsonplaceholder.typicode.com/todos/1';
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              console.log('responseText',this.responseText);                
              return this.responseText;
            }
        }       
        xhr.send(); 
}
