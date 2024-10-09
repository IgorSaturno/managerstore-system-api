import { db } from '../../db/connection'
import { storeManagers } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

// Função para adicionar novos gerentes a uma loja
async function addNewManagersToStore(storeId: string, managerIds: string[]) {
  try {
    // Verifica se o array de managerIds não está vazio
    if (managerIds.length === 0) {
      throw new Error('O array de IDs de gerentes está vazio.')
    }

    // Itera sobre cada managerId
    for (const managerId of managerIds) {
      // Verifica se o gerente já está associado à loja
      const existingManager = await db
        .select()
        .from(storeManagers)
        .where(
          and(
            eq(storeManagers.storeId, storeId),
            eq(storeManagers.managerId, managerId),
          ),
        )
        .execute()

      // Se o gerente já está associado, pula para o próximo
      if (existingManager.length > 0) {
        console.log(
          `Gerente com ID ${managerId} já está associado à loja ${storeId}. Pulando.`,
        )
        continue
      }

      // Se não está associado, adiciona o gerente à loja
      await db.insert(storeManagers).values({
        storeId,
        managerId,
      })

      console.log(`Gerente com ID ${managerId} adicionado à loja ${storeId}.`)
    }
  } catch (error) {
    console.error('Erro ao adicionar novos gerentes à loja:', error)
    throw error // Relança o erro para ser tratado em outros lugares, se necessário
  }
}

// Exemplo de uso
const storeId = 'id-da-loja' // ID da loja que você deseja associar aos gerentes
const managerIds = ['id-do-gerente1', 'id-do-gerente2'] // IDs dos novos gerentes a serem associados

addNewManagersToStore(storeId, managerIds)
  .then(() => console.log('Associação concluída.'))
  .catch((error) => console.error('Erro na associação:', error))
