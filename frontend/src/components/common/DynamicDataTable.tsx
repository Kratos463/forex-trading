import React from 'react';

interface TableColumn {
    header: string;
    accessor: string;
}

interface DynamicTableProps {
    title: string;
    columns: TableColumn[];
    data: any[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ columns, data, title }) => {
    return (
        <div className='tableContainer'>
            {title && <h6>{title}</h6>}
            <table className='table'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{row[column.accessor]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
