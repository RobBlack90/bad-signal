const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:5000'
});


async function list(params) {
  try {
    const response = await instance.get(`/${this.path}`, {params})
    return response.data
  } catch (error) {
    throw Error(error)
  }
}

async function show(id) {
  try {
    const response = await instance.get(`/${this.path}/${id}`)
    return response.data
  } catch (error) {
    throw Error(error)
  }
}

async function create(body) {
  try {
    const response = await instance.post(`/${this.path}`, body)
    return response.data
  } catch (error) {
    throw Error(error)
  }
}

async function update(id, body) {
  try {
    return await instance.put(`/${this.path}/${id}`, body)
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

export const users = setPath('users')
export const events = setPath('events')