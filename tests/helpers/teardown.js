module.exports = async () => {
  await globalThis.app.close()
  await globalThis.mongoServer.stop()
}