import React from 'react';

import AppButton from './app-button'
import Welcome from './welcome';
var fs = require('fs'); // Habilita acesso ao File System: https://nodejs.org/api/fs.html
// Permite acesso a funcoes do back-end
const { remote } = require('electron')
const backend = remote.require('./main.js')


export default class Holerith extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            fileContent: "",
            fName: "",
            holeriths: []
        };

        var fileContent = fs.readFileSync('holerith.json');
        this.state.holeriths = JSON.parse(fileContent);

    }

 
    onClickSubmit = (e) => {
        var text = document.getElementById('pdf').innerHTML + '<script>window.print()</script>';
        fs.writeFileSync('hol.htm', text);
        backend.printWindow('hol.htm', this.execProcessCallBack);
        //e.preventDefault();
    }

    execProcessCallBack = (str) => {
       console.log(str);
    }
    printHolerith = (e) => {
        console.log('printholerith');
        var text = document.getElementById('pdf').innerHTML + '<script>window.print()</script>';
        fs.writeFileSync('hol.htm', text);
        backend.printHolerith('hol.htm', this.execProcessCallBack);
    }
    render() {
        const items = this.state.holeriths.map(function(item, index){
            return (
                <div key={index} className ="holerith" >
                <div className ="page">
                    <div className ="box1">
                   
                    </div>
                    <div className ="box2">
                    <table width="100%">
        <tbody>
        <tr style={{backgroundColor:"#CCCCCC", textAlign:"center"}}>
            <td colSpan="6">DEMONSTRATIVO DE PAGAMENTO</td>
        </tr>
        <tr style={{backgroundColor:"#FFFFFF"}}>
            <td colSpan="6">Empresa</td>
        </tr>
        <tr style={{backgroundColor:"#CCCCCC"}}>
            <td colSpan="6">{item.empresa}</td>
        </tr>
        <tr style={{backgroundColor:"#FFFFFF"}}>
            <td>REGISTRO</td>
            <td colSpan="5">FUNCION&Aacute;RIO</td>
        </tr>
        <tr style={{backgroundColor:"#CCCCCC"}}>
            <td>{item.matricula}</td>
            <td colSpan="5">{item.nome}</td>
        </tr>
        <tr style={{backgroundColor:"#FFFFFF"}}>
            <td>DPTO.</td>
            <td>SETOR</td>
            <td>SE&Ccedil;&Atilde;O</td>
            <td>FUN&Ccedil;&Atilde;O</td>
            <td>REFER&Ecirc;NCIA</td>
            <td>PAG</td>
        </tr>
        <tr style={{backgroundColor:"#CCCCCC"}}>
            <td>{item.emp_local}</td>
            <td>{item.dpto}</td>
            <td>{item.secao}</td>
            <td>{item.funcao}</td>
            <td>{item.referencia}</td>
            <td>PAG</td>
        </tr>
        </tbody>
    </table>
    <img src="./logo.png" />
                    </div>
                    <div className ="box3">
                    Box 3
                    </div>
                </div>
                <div className ="page">
                <div className ="subpage">Page 2/2</div>
                </div>
            </div> 
                );
          });



        return (
            <div>
             <AppButton onClick={() => { this.printHolerith() }}>PrintHolerith</AppButton>
            <AppButton onClick={() => { this.onClickSubmit() }}>Imprimir</AppButton>
            <div id="pdf">
                <link rel="stylesheet" href="./holerith.css" />
                {items}
            </div>
            </div>
        )
    }
}
