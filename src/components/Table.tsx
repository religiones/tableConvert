import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const TableWrap: React.FC<{}> = () => {
    const [tableState, setTableState] = useState({
        dataSource : []
    });

    const columns = [{
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

    useEffect(()=>{
        axios.defaults.baseURL = "http://127.0.0.1:3070";
        axios.get("/user/getAllUser",{
            headers: {'Content-Type':'application/json;charset=utf-8'}
        }).then(({data, status}) => {
            if(status === 200) setTableState({dataSource: data["data"]["data"]});
            const tableData = tableState["dataSource"];
            console.log(tableData);

        });
    },[]);
    return (
        <div style={{width:'100%', height:'100%'}}>
            <Table columns={columns}/>
        </div>
    );
};

export default TableWrap