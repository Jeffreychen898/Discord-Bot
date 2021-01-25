function evaluate(parameters, message) {
  let expression = parameters.join("");
  let components = [];
  let operations = [[], [], []];
  let operation_tracker = new Map([
    ['^', 0],
    ['*', 1],
    ['/', 1],
    ['%', 1],
    ['-', 2],
    ['+', 2],
  ]);

  /* break down the expression into components */
  let parsed_number = undefined;
  for(let i=0;i<expression.length;i++) {
    /* parse the number */
    if(parseInt(expression[i])) {
      if(parsed_number == undefined) parsed_number = 0;
      parsed_number = parsed_number * 10 + parseInt(expression[i]);
      if(i == expression.length - 1) {
        components.push(parsed_number);
        break;
      }
    } else {
      if(parsed_number != undefined) {
        components.push(parsed_number);
        parsed_number = undefined;
      }
    }
    /* if it is an operation, store it in operations */
    if(operation_tracker.has(expression[i])) {
      operations[operation_tracker.get(expression[i])].push(components.length);
      components.push(expression[i]);
    }
  }
  let result = evaluateExpression(components, operations, message);
  if(result != undefined) {
    message.channel.send(result);
  } else {
    message.channel.send("[ERROR] An unexpected error has occured!");
  }
}
function evaluateExpression(components, operations, message) {
  if(components.length == 1) return components[0];
  let operation_list_index = -1;
  for(let i=0;i<operations.length;i++) {
    if(operations[i].length > 0) {
      operation_list_index = i;
      break;
    }
  }
  if(operation_list_index == -1) {
    return undefined;
  }
  let operation_index = operations[operation_list_index][0];
  if(operation_index < 1 || operation_index > components.length - 2) {
    message.channel.send("[ERROR] There may be a flaw in your expression!");
    return undefined;
  } else {
    let result = 0;
    let left = components[operation_index - 1];
    let right = components[operation_index + 1];
    if(typeof(left) != "number" || typeof(right) != "number") {
      message.channel.send("[ERROR] There may be a flaw in your expression!");
      return undefined;
    }
    let solution = evaluateSolution(components, operation_index, left, right, message);
    if(solution == undefined) {
      return undefined;
    }
    components[operation_index] = solution;
    components.splice(operation_index + 1, 1);
    components.splice(operation_index - 1, 1);
    remapOperationsIndex(operation_index, operations);
    operations[operation_list_index].splice(0, 1);
    return evaluateExpression(components, operations, message);
  }
}

function remapOperationsIndex(index, operations) {
  for(let i=0;i<operations.length;i++) {
    operations[i] = operations[i].map((numbers) => {
      if(numbers > index) {
        return numbers - 2;
      }
      return numbers;
    })
  }
}

function evaluateSolution(components, operation_index, left, right, message) {
  let result = 0;
  switch(components[operation_index]) {
    case '+':
    result = left + right;
    break;
    case '-':
    result = left - right;
    break;
    case '*':
    result = left * right;
    break;
    case '/':
    if(right != 0) {
      result = left / right;
    } else {
      message.channel.send("[ERROR] division by 0!");
      return undefined;
    }
    break;
    case '%':
    if(right != 0) {
      result = left % right;
    } else {
      message.channel.send("[ERROR] modulo by 0!");
      return undefined;
    }
    break;
    case '^':
    result = Math.pow(left, right);
    break;
  }
  return result;
}

module.exports = {
  evaluate: evaluate
}
