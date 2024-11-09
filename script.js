// Função para criar células de entrada com tipo e valor padrão
function createInputCell(type = 'text', defaultValue = '') {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = type;
    input.value = defaultValue;
    cell.appendChild(input);
    return cell;
}

// Adiciona nova linha na tabela
document.getElementById('addRow').addEventListener('click', function() {
    const table = document.getElementById('livroCaixa').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr');
    newRow.appendChild(createInputCell('date'));
    newRow.appendChild(createInputCell('text'));
    newRow.appendChild(createInputCell('number', 0));
    newRow.appendChild(createInputCell('number', 0));
    table.appendChild(newRow);
    updateSaldo();
});

// Atualiza o saldo em caixa
function updateSaldo() {
    const table = document.getElementById('livroCaixa').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    let totalEntrada = 0;
    let totalSaida = 0;

    for (let i = 0; i < rows.length; i++) {
        const entrada = parseFloat(rows[i].cells[2].getElementsByTagName('input')[0].value) || 0;
        const saida = parseFloat(rows[i].cells[3].getElementsByTagName('input')[0].value) || 0;
        totalEntrada += entrada;
        totalSaida += saida;
    }

    const saldo = totalEntrada - totalSaida;
    document.getElementById('saldo').innerText = saldo.toFixed(2);
}

document.getElementById('livroCaixa').addEventListener('input', updateSaldo);

// Exporta a tabela para XLSX
document.getElementById('download').addEventListener('click', function() {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [['Data', 'Descrição', 'Entrada', 'Saída']]; // Cabeçalhos
    const table = document.getElementById('livroCaixa');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Ignora a linha de cabeçalho
        const rowData = Array.from(rows[i].getElementsByTagName('input')).map(input => input.value || '');
        worksheetData.push(rowData);
    }

    worksheetData.push(['', '', 'Saldo em Caixa:', document.getElementById('saldo').innerText]);
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Livro Caixa');
    XLSX.writeFile(workbook, 'livro_caixa.xlsx');
});
