import React from "react";
import History from "./History";


const HistoryList = (props) => {
    const { dataHistory } = props;


    return (
        <div className="fix">
            <div className="history-main">
                <h2>Your transactions</h2>
                <div className="container">
                    {dataHistory.map((obj, index) => <History key={obj.blockNumber} obj={obj} index={obj.blockNumber}/>)}
                </div>
                <p className="maker">This DApp is created by Vuong Huu Hung</p>
            </div>
        </div>
    )
}

export default HistoryList;