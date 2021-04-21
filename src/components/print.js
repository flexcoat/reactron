import React from 'react';

import AppButton from './app-button'
import Welcome from './welcome';
var fs = require('fs'); // Habilita acesso ao File System: https://nodejs.org/api/fs.html
// Permite acesso a funcoes do back-end
const { remote } = require('electron')
const backend = remote.require('./main.js')


export default class Print extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            fileContent: "",
            fName: "",
            holeriths: []
        }

    }

    selectFiles = (event) => {
        var input = event.target;
        var files = input.files;

        // "Varre" os arquivos selecionados
        let cFile = files[0].path


        // Atualiza state com os arquivos selecionados
        this.setState({ fName: cFile });
    }

    processFile = () => {
        // Abre arquivo reactron.ini no mesmo nivel do executavel
        var fileContent = fs.readFileSync(this.state.fName, 'latin1');
        //var fileContent = fs.readFileSync('holerith.html', 'utf-8');

        var textByLine = fileContent.split("\n");
        const nBase = 33;
        const nHoleriths = textByLine.length / 33;

        var aHoleriths = [];

        let pos = 1;

        for (let j = 0; j < nHoleriths ; j++) {
            let i = 0;
            var holerith = {}
            holerith.empresa = textByLine[j * nBase + i].substring(0, 45).trim();
            holerith.referencia = textByLine[j * nBase + i].substring(45).trim();
            i = 2;
            holerith.matricula = textByLine[j * nBase + i].substring(0, 10).trim();
            holerith.nome = textByLine[j * nBase + i].substring(10).trim();
            i = 3;
            holerith.cod_funcao = textByLine[j * nBase + i].substring(0, 18).trim();
            holerith.funcao = textByLine[j * nBase + i].substring(18, 41).trim();
            holerith.emp_local = textByLine[j * nBase + i].substring(41, 44).trim();
            holerith.dpto = textByLine[j * nBase + i].substring(44, 47).trim();
            holerith.secao = textByLine[j * nBase + i].substring(47).trim();

            i = 6;
            holerith.lancamentos = [];
            for (i = 6; i <= 22; ++i){ 
                let item = textByLine[j * nBase + i];
                let lanc =
                {
                    cod: item.substring(0, 4).trim(),
                    descricao: item.substring(4, 30).trim(),
                    ref: item.substring(30, 41).trim(),
                    vencimentos: item.substring(41, 55).trim(),
                    descontos: item.substring(55).trim(),
                };

                holerith.lancamentos.push(lanc);
            }
            i = 23;
            holerith.total_venc = textByLine[j * nBase + i].substring(43, 54);
            holerith.total_desc = textByLine[j * nBase + i].substring(54);
            i = 25;
            holerith.valor_liq = textByLine[j * nBase + i].substring(54);
            i = 27;
            holerith.base_inss = textByLine[j * nBase + i].substring(0, 12);
            holerith.base_fgts = textByLine[j * nBase + i].substring(12, 26);
            holerith.fgts = textByLine[j * nBase + i].substring(26, 40);
            holerith.base_irrf = textByLine[j * nBase + i].substring(40, 53);
            holerith.faixa_irrf = textByLine[j * nBase + i].substring(53);
            
            console.log(holerith);
            aHoleriths.push(holerith);
        }
        fs.writeFileSync('holerith.json', JSON.stringify(aHoleriths));
        // Atualiza state com o conteudo do arquivo ini
        this.setState({ fileContent: fileContent, holeriths: aHoleriths });
        //  this.setState({ fName: 'holerith.html' });
    }


    onClickSubmit = (e) => {
        backend.printWindow(this.state.fName, this.execProcessCallBack)
        //e.preventDefault();
    }

    execProcessCallBack = (str) => {
        document.getElementById("execProcessCallBack").innerHTML += "<pre>" + str + "</pre>"
    }

    openPrint = () => {
        console.log(this.props.mainApp);
    }
    render() {
        return (
            <div>
                {/* Exibe callback do back-end */}
                <div id="execProcessCallBack"></div>
                <p align="right"><b></b>  </p>

                <h2></h2>
                <p>Informe o arquivo de holerith</p>

                {/* Selecao de arquivos */}
                <input
                    accept="all/*.*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={() => { this.selectFiles(event) }} />
                <label htmlFor="raised-button-file">
                    <AppButton component="span">
                        Seleciona arquivo
                    </AppButton>
                </label>
                <h3>Arquivo selecionado</h3>
                <pre>{this.state.fName}</pre>

                {/* Manipulacao de arquivos INI */}
                <AppButton onClick={() => { this.processFile() }}>Gerar Arquivo de Impressão</AppButton>
                <AppButton onClick={() => { this.onClickSubmit() }}> Arquivo de Impressão</AppButton>

                <AppButton onClick={() => { this.openPrint() }}>Outra Tela</AppButton>
                <h3>Conteúdo do Arquivo </h3>
                <pre>{this.state.fileContent}</pre>
                
                
                
            </div>
        )
    }
}
