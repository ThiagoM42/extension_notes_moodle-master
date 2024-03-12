//https://code.tutsplus.com/pt/tutorials/developing-google-chrome-extensions--net-33076
//https://acervolima.com/extensao-do-chrome-marcador-do-youtube/


const form = document.querySelector('form');
const bt_reset = document.querySelector('.bt_reset')
const bt_update = document.querySelector('.bt_update')

let dados = []
const addNotas = (dados)=>{    
    // document.body.style.background = 'red';
    const [nome_, nota_] = Object.keys(dados[0])
    console.log(nome_)
    let users = document.querySelectorAll(".user.cell.c1")
          
    users.forEach((user)=>{   
        const aluno = dados.find(el=>String(el[nome_]).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s{2,}/g, " ")
        ==user.children[1].innerText.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s{2,}/g, " ")) 
        
        if(aluno){
            user.nextElementSibling.nextElementSibling.children[1].value = aluno[nota_]==""?"":aluno[nota_].replace('.',',').replace(/\s{2,}/g, " ")
        }            
    })    
}

const resetNotas = ()=>{           
    let users = document.querySelectorAll(".user.cell.c1")
     
    users.forEach((user)=>{   
        user.nextElementSibling.nextElementSibling.children[1].value = ""           
    })    
}

const updateNotas = (dados)=>{       
    const [nome_, nota_] = Object.keys(dados[0])
    console.log(nome_)
    let users = document.querySelectorAll(".user.cell.c1")
          
    users.forEach((user)=>{   
        //remover acentos
        const aluno = dados.find(el=>String(el[nome_]).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s{2,}/g, " ")
        ==user.children[1].innerText.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s{2,}/g, " "))
        
        if(aluno){
            //remover acentos
            console.log(parseFloat(user.nextElementSibling.nextElementSibling.children[1].value.replace(',','.'))+"---"+parseFloat(aluno[nota_].replace(',','.')))
            if(parseFloat(user.nextElementSibling.nextElementSibling.children[1].value.replace(',','.')) != parseFloat(aluno[nota_].replace(',','.'))){
                user.nextElementSibling.nextElementSibling.children[1].value = aluno[nota_]==""?"":aluno[nota_].replace('.',',')
            }
        }            
    })     
}

const convert_text_in_json =(notas_)=>{
    let notas = notas_.split('\n')      
    notas.shift()

    const dados =[]
    notas.forEach(el=>{
        const dados_obj = {}
        let [nome, nota] = (el.split('\t'))
        Object.assign(dados_obj, {'nome':nome, 'nota':nota})
        console.log(dados_obj)
        dados.push(dados_obj)    
    })    
    return dados
}

form.addEventListener('submit', async (event)=>{
    dados =(convert_text_in_json(document.querySelector('.input').value))
    event.preventDefault();

    // alert('está funcionando')    
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.scripting.executeScript({
        target: {tabId:tab.id},
        function: addNotas,
        args:[dados]
    });

})

bt_update.addEventListener('click', async (event)=>{   
    dados =(convert_text_in_json(document.querySelector('.input').value))
    event.preventDefault();

    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    //console.log(para a execução pelo chrome)
    chrome.scripting.executeScript({
        target: {tabId:tab.id},
        function: updateNotas,
        args:[dados]
    });
})

bt_reset.addEventListener('click', async (event)=>{    
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    //console.log(para a execução pelo chrome)
    chrome.scripting.executeScript({
        target: {tabId:tab.id},
        function: resetNotas
    });
})

