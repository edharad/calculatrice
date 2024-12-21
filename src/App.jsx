import './App.css'
import React from "react"

const numbers = /[0-9]/,
      isOperator = /[x/+-]/,
      endsWithOperator = /[x/+-]$/,
      endsWithNegative = /\d[x/+-]{1}-$/;

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      result: "",
      evaluated: false
    }
    this.maxDigit = this.maxDigit.bind(this)
    this.handleNumbers = this.handleNumbers.bind(this)
    this.handleDecimals = this.handleDecimals.bind(this)
    this.handleOperators = this.handleOperators.bind(this)
    this.handleEvaluation = this.handleEvaluation.bind(this)
    this.initialize = this.initialize.bind(this)   
  }
  
  maxDigit() {
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal,
    }),
    setTimeout(() => this.setState({currentVal: this.state.prevVal}), 1000)
  }
  
  handleNumbers(e) {   
    if(!this.state.currentVal.includes("Limit")) {
      const {currentVal: a, formula: b, evaluated: r} = this.state,
            s = e.target.value; 
      this.setState({ evaluated: false }),
      a.length > 21 ? this.maxDigit() : r ? this.setState({
        currentVal: s,
        formula: "0" !== s ? s : "",
      }) : this.setState({
        currentVal: "0" === a || isOperator.test(a) ? s : a + s,
        formula: "0" === a && "0" === s ? "" === b ? s : b : /([^.0-9]0|^0)$/.test(b) ? b.slice(0, -1) + s : b + s
      })
    }
  }
  
  handleDecimals() {
    if (this.state.evaluated) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false
      })
    } else if (!this.state.currentVal.includes(".") && !this.state.currentVal.includes("Limit")) {
      this.setState({ evaluated: false })
      this.state.currentVal.length > 21 ? this.maxDigit() : endsWithOperator.test(this.state.formula) || "0" === this.state.currentVal && "" === this.state.formula ? this.setState({
        currentVal: "0.",
        formula: this.state.formula + "0."
      }) : this.setState({
        currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
        formula: this.state.formula + "."
      })
    }
  }
  
  handleEvaluation() {
    if (!this.state.currentVal.includes("Limit")) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/--/g, "+");
      let answer = Math.round(1e12 * eval(expression)) / 1e12;
      this.setState({
        currentVal: answer.toString(),
        formula: expression.replace(/\*/g, "⋅") + "=" + answer,
        prevVal: answer,
        evaluated: true
      })
    }
  }
  
  handleOperators(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const t = e.target.value,
            {formula: a, prevVal: r, evaluated: s} = this.state;
      this.setState({
        currentVal: t,
        evaluated: false
      }),
      s ? this.setState({
        formula: r + t
      }) : endsWithOperator.test(a) ? endsWithNegative.test(a) ? "-" !== t && this.setState({
        formula: r + t
      }) : this.setState({
        formula: (endsWithNegative.test(a + t) ? a : r) + t
      }) : this.setState({
        prevVal: a,
        formula: a + t
      })
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      formula: "",
      prevVal: "0",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    })
  }
    
  render() {
    return (
      <div className="calculator">
        <Formula formula={this.state.formula.replace(/x/g, "⋅")} />
        <Output output={this.state.currentVal} />
        <Buttons 
          number={this.handleNumbers}
          initial={this.initialize}
          operation={this.handleOperators}
          result={this.handleEvaluation}
          decimal={this.handleDecimals}
        />
      </div>
    )
  }
}

class Formula extends React.Component {
  render() {
    return <div className="fScreen">{this.props.formula}</div>
  }
}

class Output extends React.Component {
  render() {
    return <div className="output" id="display">{this.props.output}</div>
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttons">
        <button onClick={this.props.initial} id="clear" className="ac" value="AC">AC</button>
        <button onClick={this.props.operation} id="divide" className="operator" value="/">/</button>
        <button onClick={this.props.operation} id="multiply" className="operator" value="x">X</button>
        <button onClick={this.props.number} id="seven" className="number" value="7">7</button>
        <button onClick={this.props.number} id="eight" className="number" value="8">8</button>
        <button onClick={this.props.number} id="nine" className="number" value="9">9</button>
        <button onClick={this.props.operation} id="subtract" className="operator" value="-">-</button>
        <button onClick={this.props.number} id="four" className="number" value="4">4</button>
        <button onClick={this.props.number} id="five" className="number" value="5">5</button>
        <button onClick={this.props.number} id="six" className="number" value="6">6</button>
        <button onClick={this.props.operation} id="add" className="operator" value="+">+</button>
        <button onClick={this.props.number} id="one" className="number" value="1">1</button>
        <button onClick={this.props.number} id="two" className="number" value="2">2</button>
        <button onClick={this.props.number} id="three" className="number" value="3">3</button>
        <button onClick={this.props.result} id="equals" className="result" value="=">=</button>
        <button onClick={this.props.number} id="zero" className="number" value="0">0</button>
        <button onClick={this.props.decimal} id="decimal" className="number" value=".">.</button>
      </div>
    )
  }
}

export default Calculator;




