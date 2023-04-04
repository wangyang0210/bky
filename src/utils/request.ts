export default async function request(
  url: string = '',
  option: object = {},
  method: string = 'GET',
  data: object = {}
): Promise<void> {
  const options: object = {
    method,
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }
  Object.assign(options, option)
  if (Object.keys(data).length > 0) Object.assign(options, { body: JSON.stringify(data) })
  const response = await fetch(url, options)
  return await response.json()
}
