class Api {
  async getAllCats() {
    const r = await fetch('http://localhost:3000/cats')
    const body = await r.json()
    return body
  }

  // ?paramName=pvalue&paramName=paramV
  // http://localhost:3000/cats?name=toxi%26
  async getAllCatsByBloodType(types) {
    const url = new URL('http://localhost:3000/cats')

    // 3 варианта, как добавить параметр в url
    // const query = new URLSearchParams({ blood_type: type })
    // url.searchParams.set('blood_type', type)
    types.forEach((type) => {
      url.searchParams.append('blood_type', type)
    })

    const r = await fetch(url)
    const body = await r.json()
    return body
  }

  async createCat(cat) {
    const r = await fetch('http://localhost:3000/cats', {
      method: 'POST',
      body: JSON.stringify(cat),
    })
    const body = await r.json()
    return body
  }

  async updateCat(id, updates) {
    const r = await fetch(`http://localhost:3000/cats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    const body = await r.json()
    return body
  }

  async deleteCat(id) {
    const r = await fetch(`http://localhost:3000/cats/${id}`, { method: 'DELETE' })
    const body = await r.json()
    return body
  }
}

const api = new Api()

async function main() {
  // await api.createCat({ name: 'blacky' }).then(console.log)
  // await api.updateCat('18ad', { name: 'tesla3' }).then(console.log)
  // await api.deleteCat('d68c').then(console.log)

  await api.getAllCatsByBloodType([1, 2]).then((cats) => {
    let table = `
  <table>
    <thead>
        <tr>
          <td>id</td>
          <td>name</td>
          <td>is black</td>
          <td>blood type</td>
        </tr>
    <thead>
    <tbody>
  `
    cats.forEach((cat) => {
      table += `
      <tr>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.is_black}</td>
        <td>${cat.blood_type}</td>
      </tr>
    `
    })
    table += `</tbody></table>`
    document.body.innerHTML = table
  })
}

main()
