import React  from "react";
import { useState, useRef } from "react";

const History = (props) => {
    const { obj } = props;
    console.log(obj);
    const [isOpen, setIsOpen] = useState(false);

    const parentRef = useRef();

    return (
        <div className="accordion">
            <button type="button" className={isOpen ? "accordion__btn accordion__btn--active" : "accordion__btn "} onClick={() => setIsOpen(!isOpen)}>{obj.date}</button>
            <div 
                ref={parentRef} 
                style={isOpen 
                    ? {
                        height: parentRef.current.scrollHeight + 'px',
                    } : {
                        height: "0px",
                    }} 
                className="accordion__content-parent">
                <div className="accordion__content">
                    <table>
                        <tbody>
                            <tr>
                                <td>timestamp</td>
                                <td>{obj.timeStamp}</td>
                            </tr>
                            <tr>
                                <td>blockhash</td>
                                <td>
                                    <a target={"_blank"} href={`https://rinkeby.etherscan.io/block/${obj.blockNumber}`}>{obj.blockHash}</a>
                                </td>
                            </tr>
                            <tr>
                                <td>txhash</td>
                                <td>
                                    <a target={"_blank"} href={`https://rinkeby.etherscan.io/tx/${obj.txHash}`}>{obj.txHash}</a>
                                </td>
                            </tr>
                            <tr>
                                <td>cid</td>
                                <td>
                                    <a target={"_blank"} href={`https://ipfs.io/ipfs/${obj.CID}`}>{obj.CID}</a>
                                </td>
                            </tr>
                            <tr>
                                <td>content on IPFS</td>
                                <td>{obj.content}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default History;