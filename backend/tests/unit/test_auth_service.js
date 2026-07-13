const authService = require('../../src/services/authService');
const { createUser, TEST_PASSWORD } = require('../helpers/fixtures');

describe('Unit: authService', () => {
  test('login con bcrypt.compare correcto emite par de tokens', async () => {
    const { user } = await createUser('dispatcher');
    const result = await authService.login({ email: user.email, password: TEST_PASSWORD });
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.role).toBe('dispatcher');
  });

  test('login con password incorrecta lanza HttpError 401 genérico', async () => {
    const { user } = await createUser('dispatcher');
    await expect(authService.login({ email: user.email, password: 'nope' })).rejects.toMatchObject({
      status: 401,
      publicMessage: authService.INVALID_CREDENTIALS_MESSAGE,
    });
  });

  test('refresh con token de otra sesión ya revocado (denylist hit) lanza 401', async () => {
    const { user } = await createUser('supervisor');
    const { refreshToken } = await authService.login({ email: user.email, password: TEST_PASSWORD });

    await authService.logout(refreshToken);

    await expect(authService.refresh(refreshToken)).rejects.toMatchObject({ status: 401 });
  });

  test('logout es idempotente (segunda llamada con mismo token no falla)', async () => {
    const { user } = await createUser('tecnico');
    const { refreshToken } = await authService.login({ email: user.email, password: TEST_PASSWORD });

    await expect(authService.logout(refreshToken)).resolves.not.toThrow();
    await expect(authService.logout(refreshToken)).resolves.not.toThrow();
  });
});
