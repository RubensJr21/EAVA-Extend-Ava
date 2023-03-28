console.log(chrome)

const properties =  {
    id: "new-event",
    contexts: ["link"],
    targetUrlPatterns: ["https://ava.cefor.ifes.edu.br/calendar/view.php?view=day*"],
    title: "Criar nova atividade no Calendário do Google",
    type: "normal",
    visible: true
}

try {
    chrome.contextMenus.create(
        properties,
        () => {/* Callback */},
    )
} catch(e){
    console.log("error:", e.message)
}
    
chrome.contextMenus.onClicked.addListener(async function(info, tab) {
    if (info.menuItemId == "new-event") {
        // console.log("info:", info)
        const response = await chrome.tabs.sendMessage(tab.id, {type: "send-url", url: info.linkUrl});
        // console.log("response", response);
        // console.log("chrome.tabs:", chrome.tabs)
    }
});

/*
    OnClickData info = {
        Uma flag que indica o estado de uma caixa de seleção ou item de rádio após ser clicado.
        checked: true | false,
        
        Uma flag que indica se o elemento é editável (input, textarea, etc.).
        editable: true | false, 
        
        O ID do frame do elemento onde o menu de contexto foi clicado, se estiver em um frame.
        frameId: integer, 
        
        A URL do frame do elemento onde o menu de contexto foi clicado, se estiver em um frame.
        frameUrl: string, 
        
        Se o elemento for um link, a URL para a qual ele aponta.
        linkUrl: string,

        Um de 'imagem', 'vídeo' ou 'áudio' se o menu de contexto foi ativado em um desses tipos de elementos.
        mediaType: string,

        O ID do item de menu que foi clicado.
        menuItemId: string | number,

        A URL da página onde o item de menu foi clicado. Essa propriedade não é configurada se o clique ocorreu em um contexto no qual não há página atual, como em um menu de contexto do ativador.
        pageUrl: string,
        
        O ID pai, se houver, para o item clicado.
        parentMenuItemId: string number

        O texto para a seleção de contexto, se houver.
        selectionText: string,

        Estará presente para elementos com um URL 'src'.
        srcUrl: string,

        Uma flag que indica o estado de uma caixa de seleção ou item de rádio antes de ser clicado.
        wasChecked: 
    }
*/