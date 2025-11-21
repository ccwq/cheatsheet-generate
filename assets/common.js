


const initColumnWithSidler = ()=>{

    const input = document.getElementById('columnWidth')

    if(input){
        input.addEventListener('input', function(e) {
            const width = e.target.value;
            document.getElementById('widthVal').textContent = width + 'px';
            const columns = document.getElementById('columns');
            columns.style.columnWidth = width + 'px';
        });    
    }else{
        throw new Error("未找到columnWidth元素")
    }
}

initColumnWithSidler()
