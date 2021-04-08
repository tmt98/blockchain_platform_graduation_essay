export const formatmail = (email, deviceName, deviceID, token) => {
  const text = `Chào ${email}\nThiết bị ${deviceName} (${deviceID}) của bạn đã được kích hoạt thành công.\n\nĐây là token cho thiết bị của bạn vui lòng giữ bảo mật token này chúng tôi hoàn toàn không chịu trách nhiệm nếu bạn để lộ token này.\n\nToken: ${token}\n\nCảm ơn bạn đã sủ dụng dịch vụ của chúng tôi.\n\n Iot-Fabric.`;
  return text;
};

export const formatmailrefreshtoken = (email, deviceName, deviceID, token) => {
  const text = `Chào ${email}\nThiết bị ${deviceName} (${deviceID}) của bạn đã được refresh token.\n\nĐây là token mới cho thiết bị của bạn vui lòng giữ bảo mật token này chúng tôi hoàn toàn không chịu trách nhiệm nếu bạn để lộ token này.\n\nToken: ${token}\n\nCảm ơn bạn đã sủ dụng dịch vụ của chúng tôi.\n\n Iot-Fabric.`;
  return text;
};
