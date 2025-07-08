const clerk = require('@clerk/clerk-sdk-node');
const { logEvent } = require('../utils/logger');

async function getAllUsers(req, res) {
  try {
    const users = await clerk.users.getUserList();

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress || '—',
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—',
      role: u.publicMetadata?.role || 'sem role'
    }));

    logEvent({ message: 'Consulta de utilizadores do Clerk.' });
    res.status(200).json(formatted);
  } catch (error) {
    console.error('[Erro ao buscar utilizadores do Clerk]', error);
    res.status(500).json({ message: 'Erro ao buscar utilizadores.' });
  }
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'member'].includes(role)) {
    return res.status(400).json({ message: 'Role inválida.' });
  }

  try {
    const user = await clerk.users.getUser(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    await clerk.users.updateUser(id, {
      publicMetadata: { role }
    });

    logEvent({ message: `Role de ${user.emailAddresses[0]?.emailAddress} atualizada para "${role}".` });

    res.status(200).json({ message: 'Role atualizada com sucesso.' });
  } catch (error) {
    console.error('[Erro ao atualizar role]', error);
    res.status(500).json({ message: 'Erro ao atualizar role.' });
  }
}

module.exports = { 
    getAllUsers,
    updateUserRole
 };
