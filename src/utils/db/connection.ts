import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from './entity'

export const OrmConnection = TypeOrmModule.forRootAsync({
    useFactory: async () => ({
      type: 'postgres',
      host: process.env.host,
      port: Number(process.env.port_sql),
      username: process.env.username,
      password: process.env.password,
      database: process.env.database,
      entities,
      synchronize: true,
    }),
})
  
