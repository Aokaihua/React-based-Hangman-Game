import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//显示错误的单词
class WrongLetter extends React.Component {
    render () {
        return (
            <div className='wrong-letters-container'>
                <p>Wrong Letter(s):</p>
                <p>{this.props.wrongLetters+' '}</p>
            </div>
        );
    }
}
//呈现吊死鬼
class HangmanContainer extends React.Component {
    render() {
        return (
          <div className='hangmanContainer'>
            <svg height="250" width="200" className='figure-container'>
            {/* 绞刑架 */}
                <line x1={60} y1={20} x2={140} y2={20} />  
                <line x1={140} y1={20} x2={140} y2={50}  />  
                <line x1={60} y1={20} x2={60} y2={230} />  
                <line x1={20} y1={230} x2={100} y2={230} />  
                {this.props.body[0]}
                {this.props.body[1]}
                {this.props.body[2]}
                {this.props.body[3]}
                {this.props.body[4]}
                {this.props.body[5]}
            </svg>
          </div>  
        );
    }
}
//展示单词
class Word extends React.Component {
    
    render() {
        return (
            <div
                className='word-display'>
                {this.props.letters}
            </div>
        );
    }
}
//（弹出）最终输赢消息框
class FinalMessage extends React.Component {
    render() {
        return (
            <div className='popup-container' style={{display : (this.props.winOrLoose===null)?"none":"flex"}}>
                <div className='popup'>
                    <p>{this.props.winOrLoose ==='win'?'你赢啦😆想要再玩一局吗？':`oops...😅正确的词是"${this.props.answer}"，再玩一局叭！`}</p>
                    <button 
                        className="play-again" 
                        onClick = {() => {this.props.onClick()}}
                        >
                        再来!
                    </button>
                </div>
            </div>
        );
    }
}
//弹出“已经输入字母”的notification
class Notification extends React.Component {
    render() {
        return(
            <div className={(this.props.show)? 'show-noti':'hide-noti'}>
                <span>你已经输入过这个字母啦！</span>
            </div>
        );
    }
}
//游戏
class Game extends React.Component {
    constructor(props) {
        super(props);
        //展示小人
        this.state = {
            selectedWord: '',
            selectedWordLength: 0,
            currentLetters:[],
            wrongLetters: [],
            correctLetters: [],                
            figureNotDisplay: [<circle cx={140} cy={70} r={20} className='figure-part' key={0}/>,
            <line x1={140} y1={90} x2={140} y2={150} className='figure-part' key={1}/>,
            <line x1={140} y1={120} x2={120} y2={100} className='figure-part'key={2}/>,
            <line x1={140} y1={120} x2={160} y2={100} className='figure-part' key={3}/>,
            <line x1={140} y1={150} x2={120} y2={180} className='figure-part' key={4}/>,
            <line x1={140} y1={150} x2={160} y2={180} className='figure-part' key={5}/>
            ],
            figureIsDisplay:[],
            judgeWinOrLoose: null,
            show:null,
            playable:true
        }
        
    }
    showNotification() {
        let showState = this.state.show;
        showState = true;
        this.setState({
            show: showState
        });
        setTimeout(()=>{
            showState = false;
            this.setState({
                show: showState
            });
        },2000);
        
    }
    
    //请求单词
    getWord() {
        //请求数据并将单词初始化
        fetch("https://random-words-api.vercel.app/word/")
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            //把数据赋值给 selectedState 
            // console.log(data[0]["word"]);
            const selected = data[0]["word"].toLowerCase();
            //展示词
            let letters = [];
            for (let i = 0; i< selected.length; i++) {
                letters.push(<span key= {i} className='letter' ></span>);
            }
            // console.log(selected);
                
                this.setState({
                    selectedWord:letters,
                    selectedWordLength:letters.length,
                    correctLetters:selected.split('')
                });
        })
    }

    componentDidMount() {

        this.getWord();        
        //添加时间响应器
        window.addEventListener('keydown', (e)=>{
            const wrongLetters = this.state.wrongLetters;
            if (this.state.playable) {
                if (e.keyCode >= 65 && e.keyCode <= 90) {
                    if (this.state.correctLetters.includes(e.key)) {
                        if (!this.state.currentLetters.includes(e.key)) {//如果currenLetters里没有输入的字母
                            let zimu = this.state.selectedWord;
                            for (let i =0;i<this.state.correctLetters.length;i++){
                                if (this.state.correctLetters[i]===e.key){
                                    zimu[i]=(<span key= {i} className='letter' >{e.key}</span>);
                                    const current = this.state.currentLetters;
                                    current.push(e.key);
                                    this.setState({
                                        currentLetters: current
                                    })
                                }
                            }
                                this.setState({
                                    selectedWord:zimu
                                })
                            if (this.state.currentLetters.length === this.state.selectedWordLength) {
                                this.setState({
                                    judgeWinOrLoose:'win',
                                    playable:false
                                })
                            }
                        } else {
                            this.showNotification();
                        }
                    } else {
                        if(!this.state.wrongLetters.includes(e.key)) {
                            wrongLetters.push(e.key);
                            let body = this.state.figureIsDisplay;
                            body.push(this.state.figureNotDisplay.shift());
                            this.setState({
                                wrongLetters:wrongLetters,
                                figureIsDisplay: body
                            });
                            if (this.state.wrongLetters.length === 6) {
                                this.setState({
                                    judgeWinOrLoose:'loose',
                                    playable:false
                                })
                            }
                            } else {
                                //显示已经输入该字母的notification
                                this.showNotification();
                            }
                    }
                }
            }
        })
    }
    //重置游戏
    handleClick() {
        this.setState({
            selectedWord: '',
            selectedWordLength: 0,
            currentLetters:[],
            wrongLetters: [],
            correctLetters: [],                
            figureNotDisplay: [<circle cx={140} cy={70} r={20} className='figure-part' key={0}/>,
            <line x1={140} y1={90} x2={140} y2={150} className='figure-part' key={1}/>,
            <line x1={140} y1={120} x2={120} y2={100} className='figure-part'key={2}/>,
            <line x1={140} y1={120} x2={160} y2={100} className='figure-part' key={3}/>,
            <line x1={140} y1={150} x2={120} y2={180} className='figure-part' key={4}/>,
            <line x1={140} y1={150} x2={160} y2={180} className='figure-part' key={5}/>
            ],
            figureIsDisplay:[],
            judgeWinOrLoose: null,
            show:null,
            playable:true
        });
        this.getWord();
    }        


    render() {
        //根据单词的字母数构造出对应数量的下划线
        
        return (
            <div className='father'>
                <h1>H a n g m a n  G a m e</h1>
                <p>Enter letters and have fun!</p>
                <WrongLetter wrongLetters = {this.state.wrongLetters}/>
                <HangmanContainer body = {this.state.figureIsDisplay}/>
                <Word letters = {this.state.selectedWord}/>
                <FinalMessage 
                    winOrLoose = {this.state.judgeWinOrLoose}
                    onClick = {()=>this.handleClick()}
                    answer = {this.state.correctLetters.join('')}
                />
                <Notification show = {this.state.show}/>
            </div>

        );
    }
}



    

//目前用词
const WORDS = ['happy', 'sad', 'problem', 'medicine', 'extraordinary'];



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game words = {WORDS}/>);