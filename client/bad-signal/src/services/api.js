const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:5000'
});


async function list(params) {
  try {
    const { data } = await instance.get(`/${this.path}`, {params})
    return data
  } catch (error) {
    throw Error(error)
  }
}

async function show(id) {
  try {
    const { data } = await instance.get(`/${this.path}/${id}`)
    return data
  } catch (error) {
    throw Error(error)
  }
}

async function create(body) {
  try {
    const { data } = await instance.post(`/${this.path}`, body)
    return data
  } catch (error) {
    throw Error(error)
  }
}

async function update(id, body) {
  try {
    const { data } = await instance.put(`/${this.path}/${id}`, body)
    return data
  } catch (error) {
    throw Error(error)
  }
}

async function remove(id) {
  try {
    return await instance.delete(`/${this.path}/${id}`)
  } catch (error) {
    throw Error(error)
  }
}

function setPath (pathParam) {
  return {
    path: pathParam,
    list,
    show,
    update,
    create,
    delete: remove
  }
}

export const Users = setPath('users')
export const Events = setPath('events')