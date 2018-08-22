import React from "react";
import LinearProgress from "material-ui/LinearProgress";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.initialCount = parseInt(props.count, 10);
    this.state = {
      timerCount: this.initialCount,
      qid: props.qid
    };
  } //constructor
  cleanUp() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState((prevState, props) => {
      // resets the counter for every new question
      if (prevState.qid !== props.qid) {
        return {
          timerCount: this.initialCount,
          qid: props.qid
        };
      }

      // when counter reaches 0 calls the provided function
      if (prevState.timerCount === 0) {
        props.timeUp();
        return {
          timerCount: 0
        };
      }

      // on every tick we reduce the counter value
      return {
        timerCount: prevState.timerCount - 1
      };
    });
  } //tick

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 200);
  }

  componentWillUnmount() {
    this.cleanUp();
  }
  render() {
    return (
      <LinearProgress className="Timer" mode="determinate" color="#6200EA" min={0} max={this.initialCount} value={this.initialCount-this.state.timerCount}/>
    );
  } //render
} //Timer

 {/*<div className="Timer">
        {" "}Time Remaining: {this.state.timerCount} s
      </div>*/}

export default Timer;
