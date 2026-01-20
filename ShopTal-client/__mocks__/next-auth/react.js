module.exports = {
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
};