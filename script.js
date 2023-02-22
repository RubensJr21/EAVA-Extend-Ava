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
*/