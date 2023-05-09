window.onerror = (msg, url, line, col, error) => {
  alert(error.stack);
  alert("Error at " + url + " line " + line + " col " + col);
  alert(msg);
}

var Calc;

if (Calc){}
else{
  var elt = document.getElementById('calculator');
  var Calc = Desmos.GraphingCalculator(elt);
}

let imports = ["Custom%20Functions/customFunctions.js", "Strings/String.js"];
imports = imports.map(val => "https://cdn.jsdelivr.net/gh/theRealDadsdy/desmos-userscript@master/" + val);

for (importy of imports){
  let script = document.createElement("script");
  script.src = importy;
  document.body.appendChild(script);
}

function setExpress(lineNum, text){
  text = listToString(text);
  let express = Calc.getExpressions();
  for (let i = 0; i < express.length; i++){
    if (!(express[i].secret)){
      lineNum--;
      if (lineNum == 0){
        Calc.setExpression({id: express[i].id, latex: text});
        break;
      }
    }
  }
  if (lineNum != 0){
    Calc.setExpression({latex: text});
  }
}

async function setNote(lineNum, text){
  text = listToString(text);
  let state = Calc.getState();
  let express = state.expressions.list;
  for (let i = 0; i < express.length; i++){
    if (!(express[i].secret)){
      lineNum--;
      if (lineNum == 0){
        express[i].text = text;
        break;
      }
    }
  }
  if (lineNum != 0){
    express.push({type: "text", text: text})
  }
  state.expressions.list = express;
  Calc.setState(state);
  timeout(100);
  const fields = document.querySelectorAll('.dcg-mq-root-block');
  fields.forEach(field => {
    if (field.children[0].innerHTML == "n" && field.children[1].innerHTML == "o" && field.children[2].innerHTML == "t"){
      field.removeChild(field.children[0]); field.removeChild(field.children[0]); field.removeChild(field.children[0]);
      field.removeChild(field.children[0]);
      let newElem = document.createElement("span");
      field.prepend(newElem);
      newElem.innerHTML = "note";
    }
  })
}

setTimeout(async ()=>{
  await newDesFunc("alert", alert, ["text"]);
  await newDesFunc("set", setExpress, ["lineNum", "text"]);
  await newDesFunc("note", setNote, ["lineNum", "text"]);
}, 100)