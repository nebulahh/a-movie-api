// const update = document.querySelector('#update-button')
const messageDiv = document.querySelector('#message')
const deleteButton = document.querySelectorAll('#delete-button')
const likeBtn = document.querySelectorAll('#like')

likeBtn.forEach(btn => btn.addEventListener('click', addLikes))

async function addLikes() {
  const character = this.parentNode.childNodes[1].innerText
  const movie = this.parentNode.childNodes[3].innerText
  const like =  Number(this.parentNode.childNodes[5].innerText)
  try {
    const res = await fetch('/addLikes', {
      method: 'put',
      headers: { 'Content-Type':  'application/json' },
      body: JSON.stringify({
        name: character, 
        movie: movie,
        likes: like
      })
    })
    const data = await res.json()
    console.log(data);
    location.reload(true)
  } catch (error) {
    console.error(error);
  }
}

deleteButton.forEach(btn => btn.addEventListener('click', deleteCharacter))
async function deleteCharacter(){
  const sName = this.parentNode.childNodes[1].innerText
  const bName = this.parentNode.childNodes[3].innerText

  console.log(sName, bName);
  try{
      const response = await fetch('/deleteCharacter', {
          method: 'delete',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: sName,
            movie: bName
          })
        })
      const data = await response.json()
      console.log(data)
      location.reload()

  }catch(err){
      console.log(err)
  }
}