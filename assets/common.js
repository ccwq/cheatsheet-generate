


const initColumnWithSidler = ()=>{


    const setWidth  = width=>{
        document.getElementById('widthVal').textContent = width + 'px';
        const columns = document.getElementById('columns');
        columns.style.columnWidth = width + 'px';
    }

    const input = document.getElementById('columnWidth')

    if(input){
        input.addEventListener('input', function(e) {
            const width = e.target.value;
            setWidth(width)
        });    

        // 获取root --col-width的值setWidth
        const root = document.documentElement;
        const colWidth = getComputedStyle(root).getPropertyValue('--col-width');
        setWidth(colWidth)
    }else{
        throw new Error("未找到columnWidth元素")
    }



}

initColumnWithSidler()
