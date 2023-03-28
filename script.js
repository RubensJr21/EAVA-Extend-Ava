const currentPage = window.location.href;
const activityIsChecked = (input) => {
    if(input.title.includes("Marcar como não concluído")) {
        return true;
    }
    return false;
}

const changeStateOfActivity = (li) => {
    li.classList.toggle("not-checked");
    li.classList.toggle("checked");
}

if(currentPage.includes("course")){
    [...document.querySelectorAll(".content .section .activity")].forEach((li) => {
        let form = li.querySelector("span form");
        if(form != null){
            let input = form.querySelector("input:last-child");
            input.addEventListener("click", () => {
                changeStateOfActivity(li)
            })
            if(input){
                if(activityIsChecked(input)) {
                    li.classList.add("checked");
                }else{
                    li.classList.add("not-checked");
                }
            }
        }
    })
}

if(currentPage.includes("calendar/view.php?view=month")){

    let parser = new DOMParser();

    // Criação e configuração do iframe
    const iframe = document.createElement("iframe")
    iframe.src = currentPage
    // iframe.style.width = "0.1px"
    // iframe.style.height = "0.1px"
    document.body.appendChild(iframe)
    
    // Criação e configuração do iframe auxiliar
    const iframe2 = document.createElement("iframe")
    // iframe2.style.width = "0.1px"
    // iframe2.style.height = "0.1px"
    document.body.appendChild(iframe2)

    console.log("Página calendário")
    const i = document.createElement("input")
    i.type = "submit"
    i.value = "Sincronizar com calendário do Google"
    i.id = "sync_events"
    i.onclick = (event) => {
        event.preventDefault();
        console.log("Sincronizando eventos...");
        

        // Obtenção dos links dos dias
        const calendario = document.querySelector("table.calendarmonth")
        const links_Eventos = calendario.querySelectorAll("a:not([title])")
        links_Eventos.forEach((a) => {
            console.log(a.href)
            const pos_Hashtag = a.href.indexOf("#")
            const id_from_current_Event = a.href.substring(pos_Hashtag)
            // Obtendo link direto dos Eventos (Atividades)
            iframe.src = a.href
            iframe.onload = (event) => {
                const current_event = iframe.contentWindow.document.querySelector(id_from_current_Event)
                const link_to_view_event = current_event.querySelector("a")
                console.log(link_to_view_event.href)
                // verificar se atividade já foi entregue
                iframe2.src = link_to_view_event.href
                iframe2.onload = (event) => {
                    const iframe2_document = iframe2.contentWindow.document;
                    const status_Atividade = iframe2_document.querySelector("tr:first-child > td.c1").textContent
                    if(status_Atividade == "Nenhuma tentativa"){
                        const entrega_Atividade = iframe2_document.querySelector("tr:nth-child(3) > td.c1").textContent
                        const nome_Atividade = iframe2_document.querySelector("span > a[title='Tarefa']").textContent
                        const info_Atividade = iframe2_document.querySelector("div#intro").innerText.textContent
                    }
                    
                    console.log(`Status da Atividade: ${status_Atividade}`)
                }
                console.info(iframe.contentWindow.document)
            }
        })


        console.log("links_Eventos:", links_Eventos)
    }
    const formCtrl = document.querySelector("form[action='https://ava.cefor.ifes.edu.br/calendar/event.php'")
    const divInterna = formCtrl.querySelector("div")
    divInterna.append(i)

    chrome.runtime.onMessage.addListener(
        async function(request, sender, sendResponse) {
            console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
            /*
            if (request.type === "send-url"){
                sendResponse({recived: true});
                const textoDaPaginaDoDiaComId = fetch(request.url).then((response) => response.text())
                let pageDaPaginaDoDiaComId = parser.parseFromString(textoDaPaginaDoDiaComId, "text/html");
                console.log(request.url)
                iframe.src = request.url
                const pos_Hashtag = request.url.indexOf("#")
                const id_from_current_Event = request.url.substring(pos_Hashtag)
                iframe.onload = (event) => {
                    const current_event = iframe.contentWindow.document.querySelector(id_from_current_Event)
                    const link_to_view_event = current_event.querySelector("a")
                    console.log(link_to_view_event.href)
                    // verificar se atividade já foi entregue
                    iframe2.src = link_to_view_event.href
                    iframe2.onload = (event) => {
                        const iframe2_document = iframe2.contentWindow.document;
                        const status_Atividade = iframe2_document.querySelector("tr:first-child > td.c1").textContent
                        if(status_Atividade == "Nenhuma tentativa"){
                            const entrega_Atividade = iframe2_document.querySelector("tr:nth-child(3) > td.c1").textContent
                            const nome_Atividade = iframe2_document.querySelector("span > a[title='Tarefa']").textContent
                            const info_Atividade = iframe2_document.querySelector("div#intro").innerText.textContent
                        }

                        fetch(link_to_view_event.href)
                            .then((response) => response.text())
                            .then((text) => {
                                console.log(text)
                                // Criação e configuração do iframe auxiliar
                                const iframe3 = document.createElement("iframe")
                                // iframe2.style.width = "0.1px"
                                // iframe2.style.height = "0.1px"
                                document.body.appendChild(iframe3)
                                const html = document.createElement("html")
                                html.innerHTML = text
                                console.log(html)
                                // iframe3.contentDocument = html.document
                                // iframe3.innerHTML = 
                                iframe3.srcdoc = text
                            })

                        // converter dados para o URICode, para montar o link
                        
                        // abrir nova aba no calendário do Google contendo as informações

                        console.log(`Status da Atividade: ${status_Atividade}`)
                    }
                }
            }*/
            if (request.type === "send-url")
            sendResponse({recived: true});

            // Obtendo Link da Atividade
            const textoDaPaginaDoDiaComId = await fetch(request.url).then((response) => response.text())
            let pageDaPaginaDoDiaComId = parser.parseFromString(textoDaPaginaDoDiaComId, "text/html");
            console.log(request.url)
            const pos_Hashtag = request.url.indexOf("#")
            const id_from_current_Event = request.url.substring(pos_Hashtag)
            console.log(pageDaPaginaDoDiaComId)
            const current_event = pageDaPaginaDoDiaComId.querySelector(id_from_current_Event)
            console.log(current_event)
            const link_to_view_event = current_event.querySelector("a")
            console.log(link_to_view_event.href)


            // Obtendo dados da Atividade
            const textoDaPaginaDaAtividadeSelecionada = await fetch(link_to_view_event.href).then((response) => response.text())
            let pageDaPaginaDaAtividadeSelecionada = parser.parseFromString(textoDaPaginaDaAtividadeSelecionada, "text/html");
            console.log(request.url)
            console.log(pageDaPaginaDaAtividadeSelecionada)

            const status_Atividade = pageDaPaginaDaAtividadeSelecionada.querySelector("tr:first-child > td.c1").textContent
            if(status_Atividade == "Nenhuma tentativa"){
                const entrega_Atividade = pageDaPaginaDaAtividadeSelecionada.querySelector("tr:nth-child(3) > td.c1").textContent
                const nome_Atividade = pageDaPaginaDaAtividadeSelecionada.querySelector("span > a[title='Tarefa']").textContent
                const info_Atividade = pageDaPaginaDaAtividadeSelecionada.querySelector("div#intro").textContent

                console.log({
                    status_Atividade,
                    entrega_Atividade,
                    nome_Atividade,
                    info_Atividade
                })
                // trocar abreviação do mês nas datas de entrega das atividades

                const mouths = {
                    jan: "jan",
                    feb: "feb",
                    mar: "mar",
                    abr: "apr",
                    mai: "may",
                    jun: "jun",
                    jul: "jul",
                    ago: "aug",
                    set: "sep",
                    out: "oct",
                    nov: "nov",
                    dez: "dec"
                }
                
                var mes_Sigla = Array.from(entrega_Atividade.matchAll(/\w*, [0-9]{1,2} ([a-z]{3}) [0-9]{4}/g), m => m[1])[0];

                console.log(mes_Sigla)

                const entrega_Atividade_updated = entrega_Atividade.replace(mes_Sigla, mouths[mes_Sigla])

                // obter dia e horário do fim das atividades

                const dateFinish = new Date(entrega_Atividade_updated)
                const dateStart = new Date(entrega_Atividade_updated)
                dateStart.setHours(dateStart.getHours() - 5)

                const dateFinishObject = {
                    ano: dateFinish.getFullYear(),
                    mes: dateFinish.getUTCMonth() + 1,
                    dia: dateFinish.getDate(),
                    hora: dateFinish.getHours(),
                    minutos: dateFinish.getMinutes(),
                    segundos: dateFinish.getSeconds()
                }

                const dateStartObject = {
                    ano: dateStart.getFullYear(),
                    mes: dateStart.getUTCMonth() + 1,
                    dia: dateStart.getDate(),
                    hora: dateStart.getHours(),
                    minutos: dateStart.getMinutes(),
                    segundos: dateStart.getSeconds()
                }
                
                console.log(dateFinishObject)
                console.log(dateStartObject)
                
                const SEGUNDOS_GLOBAIS = "00"

                // juntando informações já com os nomes
                const titulo = nome_Atividade;
                const datas = `${dateStartObject.ano}`
                    + `0${dateStartObject.mes}`.slice(-2)
                    + `0${dateStartObject.dia}`.slice(-2)
                    + "T"
                    + `0${dateStartObject.hora}`.slice(-2)
                    + `0${dateStartObject.minutos}`.slice(-2)
                    + SEGUNDOS_GLOBAIS
                    + "/"
                    + `${dateFinishObject.ano}`
                    + `0${dateFinishObject.mes}`.slice(-2)
                    + `0${dateFinishObject.dia}`.slice(-2)
                    + "T"
                    + `0${dateFinishObject.hora}`.slice(-2)
                    + `0${dateFinishObject.minutos}`.slice(-2)
                    + SEGUNDOS_GLOBAIS

                const detalhes = info_Atividade
                
                // converter dados para URI
                // encodeURI()
                
                // criar link do Google calendário
                /*
                    https://calendar.google.com/calendar/render
                    action=TEMPLATE
                    text=[Titulo do Evento]
                    dates=[<ANO><MES><DIA>T<HORA><MINUTO><SEGUNDOS(Sempre 00)>](20201231T193000/20201231T223000)
                    details=[Descrição do Evento]
                */
                const link = "https://calendar.google.com/calendar/render?"
                            + "action=TEMPLATE&"
                            + `text=${titulo}&`
                            + `dates=${encodeURI(datas)}&`
                            + `details=${encodeURI(detalhes)}`
                window.open(link, "_blank")

                // abrir o link do Google calendário em uma nova aba

                console.log(info_Atividade)
            }


            console.log(`Status da Atividade: ${status_Atividade}`)
        }
    );
}


const dropCursos = [
    ...document.querySelector("li:has(a[title='Cursos']) > div > ul").children
]
    .filter((li) => {
        return !["Painel", "biblioteca"]
            .includes(li.querySelector("a").title)
    })

var page = document.createElement('html');
dropCursos.forEach((li) => {
    const element_a = li.querySelector("a")
    fetch(element_a.href).then(async response => {
        const html = await response.text()
        page.innerHTML = html;
        const pathOfCourse = page.querySelector("#page-top-header").querySelector("ul").innerText
        const pertenceAoAnoAtual = pathOfCourse.includes(new Date().getFullYear())
        // const textColor = pertenceAoAnoAtual ? "hsl(90,100%,65%)" : "hsl(0,100%,75%)"
        // console.log(`%cO curso ${element_a.title}${!pertenceAoAnoAtual ? " NÃO " : ""}pertence ao ano atual`, `color:${textColor}`)
        if(pertenceAoAnoAtual){
            li.classList.add("current-course")
        } else {
            li.classList.add("old-course")
        }
    })
})



/*
    LINKS DE AJUDA:

    https://www.youtube.com/watch?v=iVkSlNNShsk

    https://www.extension.ninja/blog/post/solved-permission-is-unknown-or-url-pattern-is-malformed/

    https://stackoverflow.com/questions/5684811/in-queryselector-how-to-get-the-first-and-get-the-last-elements-what-traversal

    https://pt.stackoverflow.com/questions/87416/como-retornar-o-%C3%BAltimo-registro-de-um-array-com-javascript-ou-jquery

    https://stackoverflow.com/questions/10396634/error-in-launching-chrome-extension-for-a-specific-page

    https://stackoverflow.com/questions/7619095/how-to-inject-css-into-webpage-through-chrome-extension

    https://www.codingem.com/javascript-console-colors/#:~:text=To%20log%20colored%20text%20to,code%20as%20the%20second%20argument.&text=Remember%20that%20this%20formatting%20is,modern%20browsers%20such%20as%20Chrome.

    https://www.youtube.com/watch?v=OK3xeO1n60o

    https://stackoverflow.com/questions/6002254/get-the-current-year-in-javascript

    https://stackoverflow.com/questions/12340737/specify-multiple-attribute-selectors-in-css => (input[name=Sex][value=M])

    https://stackoverflow.com/questions/1533444/css-selector-to-match-an-element-without-attribute-x => (a[id]:not([title])) Tem atributo 'id', mas não tem 'title'

    https://developer.chrome.com/docs/extensions/reference/contextMenus

    https://stackoverflow.com/questions/66055882/chrome-extensions-use-the-background-service-worker-key-instead-manifest-vers

    https://www.youtube.com/watch?v=jZgZbWtwcIU

    https://stackoverflow.com/questions/67449788/extensions-using-event-pages-or-service-workers-must-pass-an-id-parameter-to-chr

    https://stackoverflow.com/questions/32718645/google-chrome-extension-add-the-tab-to-context-menu/32719354#32719354

    https://developer.chrome.com/docs/extensions/mv3/messaging/#simple

    https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child

    https://stackoverflow.com/questions/6102636/html-code-as-iframe-source-rather-than-a-url#:~:text=the%20Html5%27s-,srcdoc,-attribute%2C%20just%20like

    https://www.mundojs.com.br/2019/03/28/como-converter-uma-string-em-objeto-html-dom/#:~:text=parseFromString(stringContendoHTML%2C%20%22text%2F,como%20se%20manipula%20o%20DOM.

    https://stackoverflow.com/questions/13747374/how-do-i-track-whether-a-context-menu-item-is-already-created-by-my-chrome-exten#:~:text=Each%20chrome.contextMenus.create%20call%20returns%20an%20unique%20identifier.%20Store%20these%20identifiers%20in%20an%20array%20or%20hash%20to%20keep%20track%20of%20them.

    https://developer.chrome.com/docs/extensions/reference/contextMenus/#method-create:~:text=Creates%20a%20new%20context%20menu%20item.%20If%20an%20error%20occurs%20during%20creation%2C%20it%20may%20not%20be%20detected%20until%20the%20creation%20callback%20fires%3B%20details%20will%20be%20in%20runtime.lastError.

    https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError

    https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar#:~:text=There%20is%20a%20comprehensive%20doc%20for%20google%20calendar%20and%20other%20calendar%20services%3A

    https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md

    https://stackoverflow.com/questions/12845096/how-do-i-get-the-day-of-the-month-in-javascript#:~:text=Use%20date_object.getDate()%20to%20get%20the%20month%20day.

    https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object#answer-2013332

    https://stackoverflow.com/questions/4943088/how-to-subtract-2-hours-from-users-local-time#:~:text=I%20can%20confirm%20(via%20running%20in%20Chrome%27s%20Javascript%20console)%20that%20it%20works%20with%20a%20negative%20value.%20That%20is%2C%20d.setHours(d.getHours()%20%2D%2024)%20rewinds%20d%20to%20the%20same%20time%20on%20the%20previous%20day.

    https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression#:~:text=Array.from(str.matchAll(regexp)%2C%20m%20%3D%3E%20m%5B1%5D)%3B


*/