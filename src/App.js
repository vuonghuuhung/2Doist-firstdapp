import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import Todolist from './artifact/contracts/Todolist.sol/Todolist.json';
// import css
import './App.css';
import './css/Todo.css';

// Components
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import HistoryList from './components/HistoryList';
import CustomizedDialogs from './components/CustomizedDialogs';

const toBuffer = require('it-to-buffer');  

const client = new create("https://ipfs.infura.io:5001/api/v0");

const contractAddress = "0xA013D0061Dd7eD96130E773099328d4884e07675";
const contractAbi = Todolist.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());

const isNotCheckedAll = (todos = []) => todos.find(todo => !todo.done)

const filterByStatus = (todos = [], status = '', id) => {
  switch (status) {
    case 'ACTIVE':
      return todos.filter(todo => !todo.done);
    
    case 'COMPLETED':
      return todos.filter(todo => todo.done);

    case 'REMOVE':
      return todos.filter(todo => todo.id !== id);
   
    default:
      return todos;
  }
}

function App() {
  const [todosList, setTodosList] = useState([]);
  const [todoEditingId, setTodoEditingId] = useState("");
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [status, setStatus] = useState('ALL');
  const [account, setAccount] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [accountChosen, setAccountChosen] = useState("");

  let nowAccount;

  const [showDialog, setShowDialog] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [mined, setMined] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    isConnected();
    getData();
  }, []);

  const isConnected = async () => {
    const provider = await detectEthereumProvider();
    const accounts = await provider.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      console.log("account chosen: ", accounts[0]);
      setAccount(accounts[0]);
      setAccountChosen(prev => {
        nowAccount = accounts[0];
        return nowAccount;
      });
    } else {
      console.log("No authorized account found")
    }
  }

  const chooseAccount = async () => {
    const provider = await detectEthereumProvider();
    const chooseAcc = await provider.request({ method: "eth_requestAccounts" });

    console.log('chose account:', chooseAcc[0]);

    setAccount(chooseAcc[0]);
    setAccountChosen(prev => {
      nowAccount = chooseAcc[0];
      return nowAccount;
    });
    getData();
  }

  const getData = async () => {
    const result = await contract.getLastHash();
    const bufferResult = await toBuffer(client.cat(result));
    const finalRes = JSON.parse(new TextDecoder().decode(bufferResult));
    setTodosList(finalRes);

    const response = await fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${nowAccount}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=28S2UTSIUZCF5FSGXVJ9RWZQGNS6PEV9R2`)
    .then(res => res.json());
    //console.log(response);  
    const arrRes = response.result;
    //console.log(arrRes); 
    const arrHis = arrRes.filter((trans) => trans.to.toLowerCase() === contractAddress.toLowerCase());
    let arr = [];  
    arrHis.forEach(async (trans) => {
      const timestamp = new Date(trans.timeStamp * 1000);
      const iface = new ethers.utils.Interface(contractAbi);
      const CID = iface.decodeFunctionData('addHash', trans.input)['newHash'];
      const bufferResult = await toBuffer(client.cat(CID));
      const finalRes = new TextDecoder().decode(bufferResult);
      const obj = {  
        date: "" + timestamp.getDate() + "-" + timestamp.getMonth() + "-" + timestamp.getFullYear(),
        blockNumber: trans.blockNumber,
        timeStamp: timestamp + "",  
        blockHash: trans.blockHash,
        txHash: trans.hash, 
        CID: CID,
        content: finalRes 
      };
      arr = [...arr, obj];
      arr.sort((a, b) => {
        return a.blockNumber - b.blockNumber
      });
      console.log(arr);
      setDataHistory(arr);  
    });
  }
  
  const addTodo = async (todo = {}) => {
    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      const result = await client.add(JSON.stringify([...todosList, todo]));
      const sendHash = await contract.addHash(result.cid.toString());
      setShowSign(false);
      await sendHash.wait();
      setMined(true);
      setTransactionHash(sendHash.hash);
      console.log('send hash edit successfully!');
      await getData();
      
    } catch (error) {
      console.log("error:", error);
      setError(true);
    }
  }

  const getTodoEditingId = (id = '') => {
    setTodoEditingId(id);
  }

  const onEditTodo = async (todo = {}, index = -1) => {
    if (index >= 0) {
      setShowSign(true);
      setShowDialog(true);
      setMined(false);
      try {
        const list = todosList;
        list.splice(index, 1, todo);
        setTodoEditingId('');
  
        const result = await client.add(JSON.stringify(list));
        //console.log(result);
        
        const sendHash = await contract.addHash(result.cid.toString());
        setShowSign(false);
        await sendHash.wait();
        setMined(true);
        setTransactionHash(sendHash.hash);
        console.log('send hash edit successfully!');
      } catch (error) {
        console.log(error);
        setError(true);
        setTodoEditingId('');
      }
      getData();
      
    }
  }

  const markCompleted = (id = '') => {
    const updatedList = todosList.map(todo => todo.id === id ? ({ ...todo, done: !todo.done}) : todo);
    setTodosList(updatedList);
    setIsCheckedAll(!isNotCheckedAll(updatedList));
  }

  const checkAllTodos = () => {
    setIsCheckedAll(prev => !prev);
    setTodosList(prev => {
      return prev.map(todo => ({ ...todo, done: !isCheckedAll }));
    });
  }

  const setStatusFilter = (status = '') => {
    setStatus(status);
  }

  const clearCompleted = async () => {
    setShowSign(true);
    setShowDialog(true);
    setMined(false);
    try {
      const result = await client.add(JSON.stringify(filterByStatus(todosList, 'ACTIVE')));
      //console.log(result);
      const sendHash = await contract.addHash(result.cid.toString());
      setShowSign(false);
      await sendHash.wait();
      setMined(true);
      setTransactionHash(sendHash.hash);
      console.log('send hash clear successfully!');
      await getData();
      
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  // on here 
  const removeTodo = async (id = '') => {
    setShowSign(true);
    setShowDialog(true);
    setMined(false);
    try {
      const result = await client.add(JSON.stringify(filterByStatus(todosList, 'REMOVE', id)));
      //console.log(result);
      const sendHash = await contract.addHash(result.cid.toString());
      setShowSign(false);
      await sendHash.wait();
      setMined(true);
      setTransactionHash(sendHash.hash);
      console.log('send hash clear successfully!');
      await getData();
      
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }



  return (
    <div className="todoapp">
        {!account && <header className="header"><h1>2Doist</h1></header>}
        {!account && <button className='connect' onClick={chooseAccount}>Connect wallet</button>}
        {account && <Header 
          addTodo={addTodo}
        />}
        {account && <TodoList 
          isCheckedAll={isCheckedAll}
          todosList={filterByStatus(todosList, status)}
          getTodoEditingId={getTodoEditingId}
          todoEditingId={todoEditingId}
          onEditTodo={onEditTodo}
          markCompleted={markCompleted}
          checkAllTodos={checkAllTodos}
          removeTodo={removeTodo}
        />}
        {account && <Footer 
          setStatusFilter={setStatusFilter}
          status={status}
          clearCompleted={clearCompleted}
          numOfTodos={todosList.length}
          numOfTodosLeft={filterByStatus(todosList, 'ACTIVE').length}
        />}
        {account && <HistoryList dataHistory={dataHistory}/>}
        {showDialog && <CustomizedDialogs 
          showSign={showSign} 
          mined={mined} 
          transactionHash={transactionHash}
          error={error}
          setError={setError}
          getData={getData}
          setShowDialog={setShowDialog}
        />}
    </div>
  );
}

export default App;
