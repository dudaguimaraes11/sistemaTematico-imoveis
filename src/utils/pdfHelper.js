import htmlPdf from 'html-pdf-node';
import fs from 'fs';

export async function gerarPdfImovel(imovel) {
    let fotoHtml = '-';

    if (imovel.foto) {
        const base64 = fs.readFileSync(imovel.foto).toString('base64');
        fotoHtml = `<img src="data:image/jpeg;base64, ${base64}" width="120" />`;
    }

    const html = `
        <html>
            <body>
                <h1>Relatório do Imóvel</h1>
                <p>Foto: ${fotoHtml}</p>
                <p>Categoria: ${imovel.categoria || '-'} </p>
                <p>Disponível: ${imovel.disponivel || '-'} </p>
            </body>
        </html>
        `;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}

export async function gerarPdfTodos(imoveis) {
    const linhas = imoveis
        .map(
            (a) => `
    <tr>
        <td>${a.nome}</td>
        <td>${a.descricao} || '-'</td>
        <td>${a.categoria} || '-'</td>
        <td>${a.foto} || '-'</td>
    </tr>`,
        )
        .join('');

    const html = `
     <h1 style="text-align: center;">Relatório de imóveis</h1>

    <table border="1" cellSpacing="0" cellSpacing="8">
            <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Foto</th>
            </tr>
            ${linhas}
    </table>

    <p> Total: ${imoveis.length} imóveis</p>;
`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}
