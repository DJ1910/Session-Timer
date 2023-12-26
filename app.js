import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {breakTime: 5, sessionTime: 25, isTimerOn: false, isOnBreak: false, minutes: 25, seconds: 0, intervalId: null};
    this.incrementHandler = this.incrementHandler.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.timingFunction = this.timingFunction.bind(this);
    this.interval = this.interval.bind(this);
    this.reset = this.reset.bind(this);
    this.beep = React.createRef();
  }
  
  incrementHandler(event) {
    switch(event.target.id)
      {
        case 'break-increment': if(this.state.isOnBreak)
                                {
                                  this.setState((state) => ({breakTime: state.breakTime + 1, minutes: state.breakTime + 1, seconds: 0}));
                                }
                                else
                                  {
                                    this.setState((state) => ({breakTime: state.breakTime + 1}));
                                  }
                                break;
        case 'break-decrement': if(this.state.isOnBreak)
                                {
                                  this.setState((state) => ({breakTime: state.breakTime - 1, minutes: state.breakTime - 1, seconds: 0}));
                                }
                                else
                                  {
                                    this.setState((state) => ({breakTime: state.breakTime - 1}));
                                  }
                                break;
        case 'session-increment': if(!this.state.isOnBreak)
                                {
                                  this.setState((state) => ({sessionTime: state.sessionTime + 1, minutes: state.sessionTime + 1, seconds: 0}));
                                }
                                else
                                  {
                                    this.setState((state) => ({sessionTime: state.sessionTime + 1}));
                                  }
                                break;
        case 'session-decrement': if(!this.state.isOnBreak)
                                {
                                  this.setState((state) => ({sessionTime: state.sessionTime - 1, minutes: state.sessionTime - 1, seconds: 0}));
                                }
                                else
                                  {
                                    this.setState((state) => ({sessionTime: state.sessionTime - 1}));
                                  }
                                break;
      }
  }
  
  timingFunction() 
  {
    this.setState((state) => {
      let minutes = state.minutes;
      let seconds = state.seconds;
      let isOnBreak = state.isOnBreak;
      if(seconds > 0)
        {
          seconds = seconds - 1;
        }
      else if((minutes > 0) && (state.seconds === 0))
        {
          minutes = minutes - 1;
          seconds = 59;
        }
      else
        {
          if(isOnBreak)
            {
              minutes = state.sessionTime;
            }
          else
            {
              minutes = state.breakTime;
            }
          isOnBreak = !isOnBreak;
          this.beep.current.play();
        }
      return ({minutes: minutes, seconds: seconds, isOnBreak: isOnBreak});
    });
  }
  
  interval = () => {
   return setInterval(this.timingFunction, 1000);
  };
  
  startStopTimer() {
    if(!this.state.isTimerOn)
      {
        this.setState({intervalId: this.interval()});
      }
    else
      {
        clearInterval(this.state.intervalId);
        this.setState({intervalId: null});
      }
    this.setState((state) => ({isTimerOn: !state.isTimerOn}));
  }
  
  reset() {
    clearInterval(this.state.intervalId);
    this.beep.current.pause();
    this.beep.current.currentTime = null;
    this.setState({breakTime: 5, sessionTime: 25, isTimerOn: false, isOnBreak: false, minutes: 25, seconds: 0, intervalId: null});
  }
  
  render() {
    return (
      <div id="wrapper">
        <div id="stopwatch">
          <h1><span>25 + 5</span> Clock</h1>
          <div id="session-control">
              <span id="session-label">Session Length</span>
              <div className= "controls">
                <button id="session-increment" onClick= {this.incrementHandler} disabled = {((this.state.sessionTime >= 60) || (this.state.isTimerOn)) ? true : false}>
                  <i className="fa fa-arrow-up" />
                </button>
                <span id="session-length" className="time">{this.state.sessionTime}</span>
                <button id="session-decrement" onClick= {this.incrementHandler} disabled = {((this.state.sessionTime <= 1) || (this.state.isTimerOn)) ? true : false}>
                  <i className="fa fa-arrow-down" />
                </button>
              </div>
          </div>
          <div id="main">
            <div className={this.state.isTimerOn ? "outerCircle move" : "outerCircle"} style={{backgroundImage: (this.state.isTimerOn) ? ((this.state.minutes >= 1) ? 'conic-gradient(white 0, transparent 90deg)' : 'conic-gradient(red 0, transparent 90deg)') : 'none'}}></div>
            <div className="innerCircle">
              <div id="timer-label" style={{color: this.state.isTimerOn ? 'red' : 'white'}} >{this.state.isOnBreak ? "Break" : "Session"}</div>
              <div id="time-left" style={{color: (this.state.minutes >= 1) ? 'white' : 'red'}}>
                <div>{this.state.minutes < 10 ? '0' + this.state.minutes : '' + this.state.minutes}:{this.state.seconds < 10 ? '0' + this.state.seconds : '' + this.state.seconds}</div>
              </div>
              <button id="start_stop" onClick= {this.startStopTimer}>
                <i className= {this.state.isTimerOn ? "fa fa-pause-circle" : "fa fa-play-circle"} />
              </button>
              <button id="reset" onClick={this.reset}>
                <i className= "fa fa-refresh" />
              </button>
              <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" ref={this.beep} preload= 'auto'/>
            </div>
          </div>
          <div id="break-control">
              <span id="break-label">Break Length</span>
              <div className= "controls">
                <button id="break-increment" onClick= {this.incrementHandler} disabled = {((this.state.breakTime >= 60) || (this.state.isTimerOn)) ? true : false} >
                  <i className="fa fa-arrow-up" />
                </button>
                <span id="break-length" className="time">{this.state.breakTime}</span>
                <button id="break-decrement" onClick= {this.incrementHandler} disabled = {((this.state.breakTime <= 1) || (this.state.isTimerOn)) ? true : false}>
                  <i className="fa fa-arrow-down" />
                </button>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<StopWatch />, document.getElementById('target'));
