import 'antd/dist/antd.min.css'
import { Button, Col, Row, Space, Table } from 'antd';
import axios from 'axios';
import React, {Component} from 'react'
import {write , utils} from 'xlsx'
// @ts-ignore
import { exportWord } from 'mhtml-to-word'

type myTableState = {
    dataSource: Array<Object>
}

class myTable extends Component<any, myTableState> {
    constructor(props: any){
        super(props);
        this.state = {
            dataSource: []
        }
    }

    componentDidMount(){
        axios.defaults.baseURL = "http://127.0.0.1:3070";
        axios.get("/user/getAllUser",{
            headers: {'Content-Type':'application/json;charset=utf-8'}
        }).then(({data, status}) => {
            if(status == 200){
                this.setState({
                    dataSource: data["data"]
                });
            }
        });
    }

    openDownloadDialog = (url: string | Blob | MediaSource, saveName: string)  => {
        if (typeof url === 'object' && url instanceof Blob) {
          url = URL.createObjectURL(url); // 创建blob地址
        }
        const aLink = document.createElement('a');
        // @ts-ignore
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        let event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
          event = document.createEvent('MouseEvents');
          event.initMouseEvent(
            'click',
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null,
          );
        }
        aLink.dispatchEvent(event);
      }

    sheet2blob = (sheet: any, sheetName?: string) => {
        // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
        sheetName = sheetName || 'sheet1';
        const workbook = {
          SheetNames: [sheetName],
          Sheets: {},
        };
        // @ts-ignore
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        const wopts = {
          bookType: 'xlsx', // 要生成的文件类型
          bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
          type: 'binary',
        };
        // @ts-ignore
        const wbout = write(workbook, wopts);
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      
        // 字符串转ArrayBuffer
        function s2ab(s: string) {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }
      
        return blob;
      }

    toExcel = () => {
        const dataSource = this.state.dataSource;
        const excelData = [[
            '姓名','密码','邮箱','手机号码','居住地','年龄','专业','职业','性别','创建日期'
        ]];
        dataSource.forEach((item: any) =>{
            const list = [item["username"], item["password"], item["email"], item["phone"], item["city"], item["age"], item["major"], item["career"], item["sex"], item["create_date"]];
            excelData.push(list);
        });
        const sheet = utils.aoa_to_sheet(excelData);
        this.openDownloadDialog(this.sheet2blob(sheet), "userInfo.xlsx");
    }

    toWord = () => {
        exportWord({
            filename: "userInfo",
            selector: "#myTable",
            style:'span{ font-size:30px; }'
        });
    }

    columns = [{
        title: '姓名',
        dataIndex: 'username',
        key: 'username'
    },{
        title: '密码',
        dataIndex: 'password',
        key: 'password'
    },{
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },{
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone'
    },{
        title: '居住地',
        dataIndex: 'city',
        key: 'city'
    },{
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
    },{
        title: '专业',
        dataIndex: 'major',
        key: 'major'
    },{
        title: '职业',
        dataIndex: 'career',
        key: 'career'
    },{
        title: '性别',
        dataIndex: 'sex',
        key: 'sex'
    },{
        title: '创建日期',
        dataIndex: 'create_date',
        key: 'create_date'
    }];


    render(){
        const dataSource = this.state.dataSource;
        return(

            <div style={{width:'100%', height:'100%', paddingTop:"5vh"}}>
                <Row>
                    <Col span={6} offset={18}>
                        <Space>
                            <Button type='primary' onClick={this.toExcel}>转Excel</Button>
                            <Button type='primary' onClick={this.toWord}>转Word</Button>
                        </Space>
                    </Col>
                </Row>

                <Table id='myTable' style={{width:"80%", margin:"4vh auto"}} dataSource={dataSource} columns={this.columns}/>
            </div>
        )
    }
}

export default myTable