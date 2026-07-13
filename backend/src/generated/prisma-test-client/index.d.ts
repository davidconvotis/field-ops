
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RevokedRefreshToken
 * 
 */
export type RevokedRefreshToken = $Result.DefaultSelection<Prisma.$RevokedRefreshTokenPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model ExecutionRecord
 * 
 */
export type ExecutionRecord = $Result.DefaultSelection<Prisma.$ExecutionRecordPayload>
/**
 * Model EvidencePhoto
 * 
 */
export type EvidencePhoto = $Result.DefaultSelection<Prisma.$EvidencePhotoPayload>
/**
 * Model AuditLogEntry
 * 
 */
export type AuditLogEntry = $Result.DefaultSelection<Prisma.$AuditLogEntryPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.revokedRefreshToken`: Exposes CRUD operations for the **RevokedRefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RevokedRefreshTokens
    * const revokedRefreshTokens = await prisma.revokedRefreshToken.findMany()
    * ```
    */
  get revokedRefreshToken(): Prisma.RevokedRefreshTokenDelegate<ExtArgs>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs>;

  /**
   * `prisma.executionRecord`: Exposes CRUD operations for the **ExecutionRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExecutionRecords
    * const executionRecords = await prisma.executionRecord.findMany()
    * ```
    */
  get executionRecord(): Prisma.ExecutionRecordDelegate<ExtArgs>;

  /**
   * `prisma.evidencePhoto`: Exposes CRUD operations for the **EvidencePhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EvidencePhotos
    * const evidencePhotos = await prisma.evidencePhoto.findMany()
    * ```
    */
  get evidencePhoto(): Prisma.EvidencePhotoDelegate<ExtArgs>;

  /**
   * `prisma.auditLogEntry`: Exposes CRUD operations for the **AuditLogEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogEntries
    * const auditLogEntries = await prisma.auditLogEntry.findMany()
    * ```
    */
  get auditLogEntry(): Prisma.AuditLogEntryDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    RevokedRefreshToken: 'RevokedRefreshToken',
    Order: 'Order',
    ExecutionRecord: 'ExecutionRecord',
    EvidencePhoto: 'EvidencePhoto',
    AuditLogEntry: 'AuditLogEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "revokedRefreshToken" | "order" | "executionRecord" | "evidencePhoto" | "auditLogEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RevokedRefreshToken: {
        payload: Prisma.$RevokedRefreshTokenPayload<ExtArgs>
        fields: Prisma.RevokedRefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RevokedRefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RevokedRefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RevokedRefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RevokedRefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RevokedRefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RevokedRefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RevokedRefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RevokedRefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RevokedRefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          update: {
            args: Prisma.RevokedRefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RevokedRefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RevokedRefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RevokedRefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevokedRefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RevokedRefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRevokedRefreshToken>
          }
          groupBy: {
            args: Prisma.RevokedRefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RevokedRefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RevokedRefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RevokedRefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      ExecutionRecord: {
        payload: Prisma.$ExecutionRecordPayload<ExtArgs>
        fields: Prisma.ExecutionRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExecutionRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExecutionRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          findFirst: {
            args: Prisma.ExecutionRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExecutionRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          findMany: {
            args: Prisma.ExecutionRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>[]
          }
          create: {
            args: Prisma.ExecutionRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          createMany: {
            args: Prisma.ExecutionRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExecutionRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>[]
          }
          delete: {
            args: Prisma.ExecutionRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          update: {
            args: Prisma.ExecutionRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          deleteMany: {
            args: Prisma.ExecutionRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExecutionRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExecutionRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionRecordPayload>
          }
          aggregate: {
            args: Prisma.ExecutionRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExecutionRecord>
          }
          groupBy: {
            args: Prisma.ExecutionRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExecutionRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExecutionRecordCountArgs<ExtArgs>
            result: $Utils.Optional<ExecutionRecordCountAggregateOutputType> | number
          }
        }
      }
      EvidencePhoto: {
        payload: Prisma.$EvidencePhotoPayload<ExtArgs>
        fields: Prisma.EvidencePhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvidencePhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvidencePhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          findFirst: {
            args: Prisma.EvidencePhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvidencePhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          findMany: {
            args: Prisma.EvidencePhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>[]
          }
          create: {
            args: Prisma.EvidencePhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          createMany: {
            args: Prisma.EvidencePhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvidencePhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>[]
          }
          delete: {
            args: Prisma.EvidencePhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          update: {
            args: Prisma.EvidencePhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          deleteMany: {
            args: Prisma.EvidencePhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvidencePhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EvidencePhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidencePhotoPayload>
          }
          aggregate: {
            args: Prisma.EvidencePhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvidencePhoto>
          }
          groupBy: {
            args: Prisma.EvidencePhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvidencePhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvidencePhotoCountArgs<ExtArgs>
            result: $Utils.Optional<EvidencePhotoCountAggregateOutputType> | number
          }
        }
      }
      AuditLogEntry: {
        payload: Prisma.$AuditLogEntryPayload<ExtArgs>
        fields: Prisma.AuditLogEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          findFirst: {
            args: Prisma.AuditLogEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          findMany: {
            args: Prisma.AuditLogEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>[]
          }
          create: {
            args: Prisma.AuditLogEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          createMany: {
            args: Prisma.AuditLogEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>[]
          }
          delete: {
            args: Prisma.AuditLogEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          update: {
            args: Prisma.AuditLogEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogEntryPayload>
          }
          aggregate: {
            args: Prisma.AuditLogEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLogEntry>
          }
          groupBy: {
            args: Prisma.AuditLogEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogEntryCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogEntryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ordersAsClient: number
    ordersAsTechnician: number
    executionRecords: number
    auditLogEntries: number
    resolvedOrders: number
    revokedRefreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordersAsClient?: boolean | UserCountOutputTypeCountOrdersAsClientArgs
    ordersAsTechnician?: boolean | UserCountOutputTypeCountOrdersAsTechnicianArgs
    executionRecords?: boolean | UserCountOutputTypeCountExecutionRecordsArgs
    auditLogEntries?: boolean | UserCountOutputTypeCountAuditLogEntriesArgs
    resolvedOrders?: boolean | UserCountOutputTypeCountResolvedOrdersArgs
    revokedRefreshTokens?: boolean | UserCountOutputTypeCountRevokedRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersAsClientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersAsTechnicianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExecutionRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogEntryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResolvedOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRevokedRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevokedRefreshTokenWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    auditLogEntries: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogEntries?: boolean | OrderCountOutputTypeCountAuditLogEntriesArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountAuditLogEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogEntryWhereInput
  }


  /**
   * Count Type ExecutionRecordCountOutputType
   */

  export type ExecutionRecordCountOutputType = {
    photos: number
  }

  export type ExecutionRecordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | ExecutionRecordCountOutputTypeCountPhotosArgs
  }

  // Custom InputTypes
  /**
   * ExecutionRecordCountOutputType without action
   */
  export type ExecutionRecordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecordCountOutputType
     */
    select?: ExecutionRecordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExecutionRecordCountOutputType without action
   */
  export type ExecutionRecordCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvidencePhotoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    role: string | null
    activo: boolean | null
    nombre: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    role: string | null
    activo: boolean | null
    nombre: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    role: number
    activo: number
    nombre: number
    email: number
    passwordHash: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    role?: true
    activo?: true
    nombre?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    role?: true
    activo?: true
    nombre?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    role?: true
    activo?: true
    nombre?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    role: string
    activo: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    activo?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    ordersAsClient?: boolean | User$ordersAsClientArgs<ExtArgs>
    ordersAsTechnician?: boolean | User$ordersAsTechnicianArgs<ExtArgs>
    executionRecords?: boolean | User$executionRecordsArgs<ExtArgs>
    auditLogEntries?: boolean | User$auditLogEntriesArgs<ExtArgs>
    resolvedOrders?: boolean | User$resolvedOrdersArgs<ExtArgs>
    revokedRefreshTokens?: boolean | User$revokedRefreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    activo?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    role?: boolean
    activo?: boolean
    nombre?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordersAsClient?: boolean | User$ordersAsClientArgs<ExtArgs>
    ordersAsTechnician?: boolean | User$ordersAsTechnicianArgs<ExtArgs>
    executionRecords?: boolean | User$executionRecordsArgs<ExtArgs>
    auditLogEntries?: boolean | User$auditLogEntriesArgs<ExtArgs>
    resolvedOrders?: boolean | User$resolvedOrdersArgs<ExtArgs>
    revokedRefreshTokens?: boolean | User$revokedRefreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ordersAsClient: Prisma.$OrderPayload<ExtArgs>[]
      ordersAsTechnician: Prisma.$OrderPayload<ExtArgs>[]
      executionRecords: Prisma.$ExecutionRecordPayload<ExtArgs>[]
      auditLogEntries: Prisma.$AuditLogEntryPayload<ExtArgs>[]
      resolvedOrders: Prisma.$OrderPayload<ExtArgs>[]
      revokedRefreshTokens: Prisma.$RevokedRefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: string
      activo: boolean
      nombre: string
      email: string
      passwordHash: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ordersAsClient<T extends User$ordersAsClientArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersAsClientArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    ordersAsTechnician<T extends User$ordersAsTechnicianArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersAsTechnicianArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    executionRecords<T extends User$executionRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$executionRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogEntries<T extends User$auditLogEntriesArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findMany"> | Null>
    resolvedOrders<T extends User$resolvedOrdersArgs<ExtArgs> = {}>(args?: Subset<T, User$resolvedOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany"> | Null>
    revokedRefreshTokens<T extends User$revokedRefreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$revokedRefreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly activo: FieldRef<"User", 'Boolean'>
    readonly nombre: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.ordersAsClient
   */
  export type User$ordersAsClientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.ordersAsTechnician
   */
  export type User$ordersAsTechnicianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.executionRecords
   */
  export type User$executionRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    where?: ExecutionRecordWhereInput
    orderBy?: ExecutionRecordOrderByWithRelationInput | ExecutionRecordOrderByWithRelationInput[]
    cursor?: ExecutionRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionRecordScalarFieldEnum | ExecutionRecordScalarFieldEnum[]
  }

  /**
   * User.auditLogEntries
   */
  export type User$auditLogEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    where?: AuditLogEntryWhereInput
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    cursor?: AuditLogEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * User.resolvedOrders
   */
  export type User$resolvedOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.revokedRefreshTokens
   */
  export type User$revokedRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    where?: RevokedRefreshTokenWhereInput
    orderBy?: RevokedRefreshTokenOrderByWithRelationInput | RevokedRefreshTokenOrderByWithRelationInput[]
    cursor?: RevokedRefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RevokedRefreshTokenScalarFieldEnum | RevokedRefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RevokedRefreshToken
   */

  export type AggregateRevokedRefreshToken = {
    _count: RevokedRefreshTokenCountAggregateOutputType | null
    _min: RevokedRefreshTokenMinAggregateOutputType | null
    _max: RevokedRefreshTokenMaxAggregateOutputType | null
  }

  export type RevokedRefreshTokenMinAggregateOutputType = {
    jti: string | null
    userId: string | null
    revokedAt: Date | null
    expiresAt: Date | null
  }

  export type RevokedRefreshTokenMaxAggregateOutputType = {
    jti: string | null
    userId: string | null
    revokedAt: Date | null
    expiresAt: Date | null
  }

  export type RevokedRefreshTokenCountAggregateOutputType = {
    jti: number
    userId: number
    revokedAt: number
    expiresAt: number
    _all: number
  }


  export type RevokedRefreshTokenMinAggregateInputType = {
    jti?: true
    userId?: true
    revokedAt?: true
    expiresAt?: true
  }

  export type RevokedRefreshTokenMaxAggregateInputType = {
    jti?: true
    userId?: true
    revokedAt?: true
    expiresAt?: true
  }

  export type RevokedRefreshTokenCountAggregateInputType = {
    jti?: true
    userId?: true
    revokedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type RevokedRefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevokedRefreshToken to aggregate.
     */
    where?: RevokedRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevokedRefreshTokens to fetch.
     */
    orderBy?: RevokedRefreshTokenOrderByWithRelationInput | RevokedRefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RevokedRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevokedRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevokedRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RevokedRefreshTokens
    **/
    _count?: true | RevokedRefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RevokedRefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RevokedRefreshTokenMaxAggregateInputType
  }

  export type GetRevokedRefreshTokenAggregateType<T extends RevokedRefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRevokedRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRevokedRefreshToken[P]>
      : GetScalarType<T[P], AggregateRevokedRefreshToken[P]>
  }




  export type RevokedRefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevokedRefreshTokenWhereInput
    orderBy?: RevokedRefreshTokenOrderByWithAggregationInput | RevokedRefreshTokenOrderByWithAggregationInput[]
    by: RevokedRefreshTokenScalarFieldEnum[] | RevokedRefreshTokenScalarFieldEnum
    having?: RevokedRefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RevokedRefreshTokenCountAggregateInputType | true
    _min?: RevokedRefreshTokenMinAggregateInputType
    _max?: RevokedRefreshTokenMaxAggregateInputType
  }

  export type RevokedRefreshTokenGroupByOutputType = {
    jti: string
    userId: string
    revokedAt: Date
    expiresAt: Date
    _count: RevokedRefreshTokenCountAggregateOutputType | null
    _min: RevokedRefreshTokenMinAggregateOutputType | null
    _max: RevokedRefreshTokenMaxAggregateOutputType | null
  }

  type GetRevokedRefreshTokenGroupByPayload<T extends RevokedRefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RevokedRefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RevokedRefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RevokedRefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RevokedRefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RevokedRefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    jti?: boolean
    userId?: boolean
    revokedAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["revokedRefreshToken"]>

  export type RevokedRefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    jti?: boolean
    userId?: boolean
    revokedAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["revokedRefreshToken"]>

  export type RevokedRefreshTokenSelectScalar = {
    jti?: boolean
    userId?: boolean
    revokedAt?: boolean
    expiresAt?: boolean
  }

  export type RevokedRefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RevokedRefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RevokedRefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RevokedRefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      jti: string
      userId: string
      revokedAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["revokedRefreshToken"]>
    composites: {}
  }

  type RevokedRefreshTokenGetPayload<S extends boolean | null | undefined | RevokedRefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RevokedRefreshTokenPayload, S>

  type RevokedRefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RevokedRefreshTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RevokedRefreshTokenCountAggregateInputType | true
    }

  export interface RevokedRefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RevokedRefreshToken'], meta: { name: 'RevokedRefreshToken' } }
    /**
     * Find zero or one RevokedRefreshToken that matches the filter.
     * @param {RevokedRefreshTokenFindUniqueArgs} args - Arguments to find a RevokedRefreshToken
     * @example
     * // Get one RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RevokedRefreshTokenFindUniqueArgs>(args: SelectSubset<T, RevokedRefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RevokedRefreshToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RevokedRefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RevokedRefreshToken
     * @example
     * // Get one RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RevokedRefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RevokedRefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RevokedRefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenFindFirstArgs} args - Arguments to find a RevokedRefreshToken
     * @example
     * // Get one RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RevokedRefreshTokenFindFirstArgs>(args?: SelectSubset<T, RevokedRefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RevokedRefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RevokedRefreshToken
     * @example
     * // Get one RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RevokedRefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RevokedRefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RevokedRefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RevokedRefreshTokens
     * const revokedRefreshTokens = await prisma.revokedRefreshToken.findMany()
     * 
     * // Get first 10 RevokedRefreshTokens
     * const revokedRefreshTokens = await prisma.revokedRefreshToken.findMany({ take: 10 })
     * 
     * // Only select the `jti`
     * const revokedRefreshTokenWithJtiOnly = await prisma.revokedRefreshToken.findMany({ select: { jti: true } })
     * 
     */
    findMany<T extends RevokedRefreshTokenFindManyArgs>(args?: SelectSubset<T, RevokedRefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RevokedRefreshToken.
     * @param {RevokedRefreshTokenCreateArgs} args - Arguments to create a RevokedRefreshToken.
     * @example
     * // Create one RevokedRefreshToken
     * const RevokedRefreshToken = await prisma.revokedRefreshToken.create({
     *   data: {
     *     // ... data to create a RevokedRefreshToken
     *   }
     * })
     * 
     */
    create<T extends RevokedRefreshTokenCreateArgs>(args: SelectSubset<T, RevokedRefreshTokenCreateArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RevokedRefreshTokens.
     * @param {RevokedRefreshTokenCreateManyArgs} args - Arguments to create many RevokedRefreshTokens.
     * @example
     * // Create many RevokedRefreshTokens
     * const revokedRefreshToken = await prisma.revokedRefreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RevokedRefreshTokenCreateManyArgs>(args?: SelectSubset<T, RevokedRefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RevokedRefreshTokens and returns the data saved in the database.
     * @param {RevokedRefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RevokedRefreshTokens.
     * @example
     * // Create many RevokedRefreshTokens
     * const revokedRefreshToken = await prisma.revokedRefreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RevokedRefreshTokens and only return the `jti`
     * const revokedRefreshTokenWithJtiOnly = await prisma.revokedRefreshToken.createManyAndReturn({ 
     *   select: { jti: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RevokedRefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RevokedRefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RevokedRefreshToken.
     * @param {RevokedRefreshTokenDeleteArgs} args - Arguments to delete one RevokedRefreshToken.
     * @example
     * // Delete one RevokedRefreshToken
     * const RevokedRefreshToken = await prisma.revokedRefreshToken.delete({
     *   where: {
     *     // ... filter to delete one RevokedRefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RevokedRefreshTokenDeleteArgs>(args: SelectSubset<T, RevokedRefreshTokenDeleteArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RevokedRefreshToken.
     * @param {RevokedRefreshTokenUpdateArgs} args - Arguments to update one RevokedRefreshToken.
     * @example
     * // Update one RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RevokedRefreshTokenUpdateArgs>(args: SelectSubset<T, RevokedRefreshTokenUpdateArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RevokedRefreshTokens.
     * @param {RevokedRefreshTokenDeleteManyArgs} args - Arguments to filter RevokedRefreshTokens to delete.
     * @example
     * // Delete a few RevokedRefreshTokens
     * const { count } = await prisma.revokedRefreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RevokedRefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RevokedRefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevokedRefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RevokedRefreshTokens
     * const revokedRefreshToken = await prisma.revokedRefreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RevokedRefreshTokenUpdateManyArgs>(args: SelectSubset<T, RevokedRefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RevokedRefreshToken.
     * @param {RevokedRefreshTokenUpsertArgs} args - Arguments to update or create a RevokedRefreshToken.
     * @example
     * // Update or create a RevokedRefreshToken
     * const revokedRefreshToken = await prisma.revokedRefreshToken.upsert({
     *   create: {
     *     // ... data to create a RevokedRefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RevokedRefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RevokedRefreshTokenUpsertArgs>(args: SelectSubset<T, RevokedRefreshTokenUpsertArgs<ExtArgs>>): Prisma__RevokedRefreshTokenClient<$Result.GetResult<Prisma.$RevokedRefreshTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RevokedRefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenCountArgs} args - Arguments to filter RevokedRefreshTokens to count.
     * @example
     * // Count the number of RevokedRefreshTokens
     * const count = await prisma.revokedRefreshToken.count({
     *   where: {
     *     // ... the filter for the RevokedRefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RevokedRefreshTokenCountArgs>(
      args?: Subset<T, RevokedRefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RevokedRefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RevokedRefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RevokedRefreshTokenAggregateArgs>(args: Subset<T, RevokedRefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRevokedRefreshTokenAggregateType<T>>

    /**
     * Group by RevokedRefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevokedRefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RevokedRefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RevokedRefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RevokedRefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RevokedRefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRevokedRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RevokedRefreshToken model
   */
  readonly fields: RevokedRefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RevokedRefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RevokedRefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RevokedRefreshToken model
   */ 
  interface RevokedRefreshTokenFieldRefs {
    readonly jti: FieldRef<"RevokedRefreshToken", 'String'>
    readonly userId: FieldRef<"RevokedRefreshToken", 'String'>
    readonly revokedAt: FieldRef<"RevokedRefreshToken", 'DateTime'>
    readonly expiresAt: FieldRef<"RevokedRefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RevokedRefreshToken findUnique
   */
  export type RevokedRefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RevokedRefreshToken to fetch.
     */
    where: RevokedRefreshTokenWhereUniqueInput
  }

  /**
   * RevokedRefreshToken findUniqueOrThrow
   */
  export type RevokedRefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RevokedRefreshToken to fetch.
     */
    where: RevokedRefreshTokenWhereUniqueInput
  }

  /**
   * RevokedRefreshToken findFirst
   */
  export type RevokedRefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RevokedRefreshToken to fetch.
     */
    where?: RevokedRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevokedRefreshTokens to fetch.
     */
    orderBy?: RevokedRefreshTokenOrderByWithRelationInput | RevokedRefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevokedRefreshTokens.
     */
    cursor?: RevokedRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevokedRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevokedRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevokedRefreshTokens.
     */
    distinct?: RevokedRefreshTokenScalarFieldEnum | RevokedRefreshTokenScalarFieldEnum[]
  }

  /**
   * RevokedRefreshToken findFirstOrThrow
   */
  export type RevokedRefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RevokedRefreshToken to fetch.
     */
    where?: RevokedRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevokedRefreshTokens to fetch.
     */
    orderBy?: RevokedRefreshTokenOrderByWithRelationInput | RevokedRefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevokedRefreshTokens.
     */
    cursor?: RevokedRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevokedRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevokedRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevokedRefreshTokens.
     */
    distinct?: RevokedRefreshTokenScalarFieldEnum | RevokedRefreshTokenScalarFieldEnum[]
  }

  /**
   * RevokedRefreshToken findMany
   */
  export type RevokedRefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RevokedRefreshTokens to fetch.
     */
    where?: RevokedRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevokedRefreshTokens to fetch.
     */
    orderBy?: RevokedRefreshTokenOrderByWithRelationInput | RevokedRefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RevokedRefreshTokens.
     */
    cursor?: RevokedRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevokedRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevokedRefreshTokens.
     */
    skip?: number
    distinct?: RevokedRefreshTokenScalarFieldEnum | RevokedRefreshTokenScalarFieldEnum[]
  }

  /**
   * RevokedRefreshToken create
   */
  export type RevokedRefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RevokedRefreshToken.
     */
    data: XOR<RevokedRefreshTokenCreateInput, RevokedRefreshTokenUncheckedCreateInput>
  }

  /**
   * RevokedRefreshToken createMany
   */
  export type RevokedRefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RevokedRefreshTokens.
     */
    data: RevokedRefreshTokenCreateManyInput | RevokedRefreshTokenCreateManyInput[]
  }

  /**
   * RevokedRefreshToken createManyAndReturn
   */
  export type RevokedRefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RevokedRefreshTokens.
     */
    data: RevokedRefreshTokenCreateManyInput | RevokedRefreshTokenCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RevokedRefreshToken update
   */
  export type RevokedRefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RevokedRefreshToken.
     */
    data: XOR<RevokedRefreshTokenUpdateInput, RevokedRefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RevokedRefreshToken to update.
     */
    where: RevokedRefreshTokenWhereUniqueInput
  }

  /**
   * RevokedRefreshToken updateMany
   */
  export type RevokedRefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RevokedRefreshTokens.
     */
    data: XOR<RevokedRefreshTokenUpdateManyMutationInput, RevokedRefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RevokedRefreshTokens to update
     */
    where?: RevokedRefreshTokenWhereInput
  }

  /**
   * RevokedRefreshToken upsert
   */
  export type RevokedRefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RevokedRefreshToken to update in case it exists.
     */
    where: RevokedRefreshTokenWhereUniqueInput
    /**
     * In case the RevokedRefreshToken found by the `where` argument doesn't exist, create a new RevokedRefreshToken with this data.
     */
    create: XOR<RevokedRefreshTokenCreateInput, RevokedRefreshTokenUncheckedCreateInput>
    /**
     * In case the RevokedRefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RevokedRefreshTokenUpdateInput, RevokedRefreshTokenUncheckedUpdateInput>
  }

  /**
   * RevokedRefreshToken delete
   */
  export type RevokedRefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RevokedRefreshToken to delete.
     */
    where: RevokedRefreshTokenWhereUniqueInput
  }

  /**
   * RevokedRefreshToken deleteMany
   */
  export type RevokedRefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevokedRefreshTokens to delete
     */
    where?: RevokedRefreshTokenWhereInput
  }

  /**
   * RevokedRefreshToken without action
   */
  export type RevokedRefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevokedRefreshToken
     */
    select?: RevokedRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevokedRefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    version: number | null
  }

  export type OrderSumAggregateOutputType = {
    version: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    status: string | null
    clientId: string | null
    technicianId: string | null
    version: number | null
    rejectionReason: string | null
    resolvedByUserId: string | null
    createdAt: Date | null
    assignedAt: Date | null
    submittedAt: Date | null
    resolvedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    status: string | null
    clientId: string | null
    technicianId: string | null
    version: number | null
    rejectionReason: string | null
    resolvedByUserId: string | null
    createdAt: Date | null
    assignedAt: Date | null
    submittedAt: Date | null
    resolvedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    status: number
    clientId: number
    technicianId: number
    version: number
    rejectionReason: number
    resolvedByUserId: number
    createdAt: number
    assignedAt: number
    submittedAt: number
    resolvedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    version?: true
  }

  export type OrderSumAggregateInputType = {
    version?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    status?: true
    clientId?: true
    technicianId?: true
    version?: true
    rejectionReason?: true
    resolvedByUserId?: true
    createdAt?: true
    assignedAt?: true
    submittedAt?: true
    resolvedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    status?: true
    clientId?: true
    technicianId?: true
    version?: true
    rejectionReason?: true
    resolvedByUserId?: true
    createdAt?: true
    assignedAt?: true
    submittedAt?: true
    resolvedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    status?: true
    clientId?: true
    technicianId?: true
    version?: true
    rejectionReason?: true
    resolvedByUserId?: true
    createdAt?: true
    assignedAt?: true
    submittedAt?: true
    resolvedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    status: string
    clientId: string
    technicianId: string | null
    version: number
    rejectionReason: string | null
    resolvedByUserId: string | null
    createdAt: Date
    assignedAt: Date | null
    submittedAt: Date | null
    resolvedAt: Date | null
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    clientId?: boolean
    technicianId?: boolean
    version?: boolean
    rejectionReason?: boolean
    resolvedByUserId?: boolean
    createdAt?: boolean
    assignedAt?: boolean
    submittedAt?: boolean
    resolvedAt?: boolean
    client?: boolean | UserDefaultArgs<ExtArgs>
    technician?: boolean | Order$technicianArgs<ExtArgs>
    resolvedBy?: boolean | Order$resolvedByArgs<ExtArgs>
    executionRecord?: boolean | Order$executionRecordArgs<ExtArgs>
    auditLogEntries?: boolean | Order$auditLogEntriesArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    clientId?: boolean
    technicianId?: boolean
    version?: boolean
    rejectionReason?: boolean
    resolvedByUserId?: boolean
    createdAt?: boolean
    assignedAt?: boolean
    submittedAt?: boolean
    resolvedAt?: boolean
    client?: boolean | UserDefaultArgs<ExtArgs>
    technician?: boolean | Order$technicianArgs<ExtArgs>
    resolvedBy?: boolean | Order$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    status?: boolean
    clientId?: boolean
    technicianId?: boolean
    version?: boolean
    rejectionReason?: boolean
    resolvedByUserId?: boolean
    createdAt?: boolean
    assignedAt?: boolean
    submittedAt?: boolean
    resolvedAt?: boolean
  }

  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | UserDefaultArgs<ExtArgs>
    technician?: boolean | Order$technicianArgs<ExtArgs>
    resolvedBy?: boolean | Order$resolvedByArgs<ExtArgs>
    executionRecord?: boolean | Order$executionRecordArgs<ExtArgs>
    auditLogEntries?: boolean | Order$auditLogEntriesArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | UserDefaultArgs<ExtArgs>
    technician?: boolean | Order$technicianArgs<ExtArgs>
    resolvedBy?: boolean | Order$resolvedByArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      client: Prisma.$UserPayload<ExtArgs>
      technician: Prisma.$UserPayload<ExtArgs> | null
      resolvedBy: Prisma.$UserPayload<ExtArgs> | null
      executionRecord: Prisma.$ExecutionRecordPayload<ExtArgs> | null
      auditLogEntries: Prisma.$AuditLogEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
      clientId: string
      technicianId: string | null
      version: number
      rejectionReason: string | null
      resolvedByUserId: string | null
      createdAt: Date
      assignedAt: Date | null
      submittedAt: Date | null
      resolvedAt: Date | null
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    technician<T extends Order$technicianArgs<ExtArgs> = {}>(args?: Subset<T, Order$technicianArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    resolvedBy<T extends Order$resolvedByArgs<ExtArgs> = {}>(args?: Subset<T, Order$resolvedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    executionRecord<T extends Order$executionRecordArgs<ExtArgs> = {}>(args?: Subset<T, Order$executionRecordArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    auditLogEntries<T extends Order$auditLogEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Order$auditLogEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly status: FieldRef<"Order", 'String'>
    readonly clientId: FieldRef<"Order", 'String'>
    readonly technicianId: FieldRef<"Order", 'String'>
    readonly version: FieldRef<"Order", 'Int'>
    readonly rejectionReason: FieldRef<"Order", 'String'>
    readonly resolvedByUserId: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly assignedAt: FieldRef<"Order", 'DateTime'>
    readonly submittedAt: FieldRef<"Order", 'DateTime'>
    readonly resolvedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
  }

  /**
   * Order.technician
   */
  export type Order$technicianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Order.resolvedBy
   */
  export type Order$resolvedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Order.executionRecord
   */
  export type Order$executionRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    where?: ExecutionRecordWhereInput
  }

  /**
   * Order.auditLogEntries
   */
  export type Order$auditLogEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    where?: AuditLogEntryWhereInput
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    cursor?: AuditLogEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model ExecutionRecord
   */

  export type AggregateExecutionRecord = {
    _count: ExecutionRecordCountAggregateOutputType | null
    _min: ExecutionRecordMinAggregateOutputType | null
    _max: ExecutionRecordMaxAggregateOutputType | null
  }

  export type ExecutionRecordMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    technicianId: string | null
    notes: string | null
    idempotencyKey: string | null
    payloadHash: string | null
    submittedAt: Date | null
  }

  export type ExecutionRecordMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    technicianId: string | null
    notes: string | null
    idempotencyKey: string | null
    payloadHash: string | null
    submittedAt: Date | null
  }

  export type ExecutionRecordCountAggregateOutputType = {
    id: number
    orderId: number
    technicianId: number
    notes: number
    idempotencyKey: number
    payloadHash: number
    submittedAt: number
    _all: number
  }


  export type ExecutionRecordMinAggregateInputType = {
    id?: true
    orderId?: true
    technicianId?: true
    notes?: true
    idempotencyKey?: true
    payloadHash?: true
    submittedAt?: true
  }

  export type ExecutionRecordMaxAggregateInputType = {
    id?: true
    orderId?: true
    technicianId?: true
    notes?: true
    idempotencyKey?: true
    payloadHash?: true
    submittedAt?: true
  }

  export type ExecutionRecordCountAggregateInputType = {
    id?: true
    orderId?: true
    technicianId?: true
    notes?: true
    idempotencyKey?: true
    payloadHash?: true
    submittedAt?: true
    _all?: true
  }

  export type ExecutionRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExecutionRecord to aggregate.
     */
    where?: ExecutionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionRecords to fetch.
     */
    orderBy?: ExecutionRecordOrderByWithRelationInput | ExecutionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExecutionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExecutionRecords
    **/
    _count?: true | ExecutionRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExecutionRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExecutionRecordMaxAggregateInputType
  }

  export type GetExecutionRecordAggregateType<T extends ExecutionRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateExecutionRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExecutionRecord[P]>
      : GetScalarType<T[P], AggregateExecutionRecord[P]>
  }




  export type ExecutionRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionRecordWhereInput
    orderBy?: ExecutionRecordOrderByWithAggregationInput | ExecutionRecordOrderByWithAggregationInput[]
    by: ExecutionRecordScalarFieldEnum[] | ExecutionRecordScalarFieldEnum
    having?: ExecutionRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExecutionRecordCountAggregateInputType | true
    _min?: ExecutionRecordMinAggregateInputType
    _max?: ExecutionRecordMaxAggregateInputType
  }

  export type ExecutionRecordGroupByOutputType = {
    id: string
    orderId: string
    technicianId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt: Date
    _count: ExecutionRecordCountAggregateOutputType | null
    _min: ExecutionRecordMinAggregateOutputType | null
    _max: ExecutionRecordMaxAggregateOutputType | null
  }

  type GetExecutionRecordGroupByPayload<T extends ExecutionRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExecutionRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExecutionRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExecutionRecordGroupByOutputType[P]>
            : GetScalarType<T[P], ExecutionRecordGroupByOutputType[P]>
        }
      >
    >


  export type ExecutionRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    technicianId?: boolean
    notes?: boolean
    idempotencyKey?: boolean
    payloadHash?: boolean
    submittedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    technician?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | ExecutionRecord$photosArgs<ExtArgs>
    _count?: boolean | ExecutionRecordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["executionRecord"]>

  export type ExecutionRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    technicianId?: boolean
    notes?: boolean
    idempotencyKey?: boolean
    payloadHash?: boolean
    submittedAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    technician?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["executionRecord"]>

  export type ExecutionRecordSelectScalar = {
    id?: boolean
    orderId?: boolean
    technicianId?: boolean
    notes?: boolean
    idempotencyKey?: boolean
    payloadHash?: boolean
    submittedAt?: boolean
  }

  export type ExecutionRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    technician?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | ExecutionRecord$photosArgs<ExtArgs>
    _count?: boolean | ExecutionRecordCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExecutionRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    technician?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExecutionRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExecutionRecord"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      technician: Prisma.$UserPayload<ExtArgs>
      photos: Prisma.$EvidencePhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      technicianId: string
      notes: string
      idempotencyKey: string
      payloadHash: string
      submittedAt: Date
    }, ExtArgs["result"]["executionRecord"]>
    composites: {}
  }

  type ExecutionRecordGetPayload<S extends boolean | null | undefined | ExecutionRecordDefaultArgs> = $Result.GetResult<Prisma.$ExecutionRecordPayload, S>

  type ExecutionRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExecutionRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExecutionRecordCountAggregateInputType | true
    }

  export interface ExecutionRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExecutionRecord'], meta: { name: 'ExecutionRecord' } }
    /**
     * Find zero or one ExecutionRecord that matches the filter.
     * @param {ExecutionRecordFindUniqueArgs} args - Arguments to find a ExecutionRecord
     * @example
     * // Get one ExecutionRecord
     * const executionRecord = await prisma.executionRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExecutionRecordFindUniqueArgs>(args: SelectSubset<T, ExecutionRecordFindUniqueArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ExecutionRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExecutionRecordFindUniqueOrThrowArgs} args - Arguments to find a ExecutionRecord
     * @example
     * // Get one ExecutionRecord
     * const executionRecord = await prisma.executionRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExecutionRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, ExecutionRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ExecutionRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordFindFirstArgs} args - Arguments to find a ExecutionRecord
     * @example
     * // Get one ExecutionRecord
     * const executionRecord = await prisma.executionRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExecutionRecordFindFirstArgs>(args?: SelectSubset<T, ExecutionRecordFindFirstArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ExecutionRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordFindFirstOrThrowArgs} args - Arguments to find a ExecutionRecord
     * @example
     * // Get one ExecutionRecord
     * const executionRecord = await prisma.executionRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExecutionRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, ExecutionRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ExecutionRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExecutionRecords
     * const executionRecords = await prisma.executionRecord.findMany()
     * 
     * // Get first 10 ExecutionRecords
     * const executionRecords = await prisma.executionRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const executionRecordWithIdOnly = await prisma.executionRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExecutionRecordFindManyArgs>(args?: SelectSubset<T, ExecutionRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ExecutionRecord.
     * @param {ExecutionRecordCreateArgs} args - Arguments to create a ExecutionRecord.
     * @example
     * // Create one ExecutionRecord
     * const ExecutionRecord = await prisma.executionRecord.create({
     *   data: {
     *     // ... data to create a ExecutionRecord
     *   }
     * })
     * 
     */
    create<T extends ExecutionRecordCreateArgs>(args: SelectSubset<T, ExecutionRecordCreateArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ExecutionRecords.
     * @param {ExecutionRecordCreateManyArgs} args - Arguments to create many ExecutionRecords.
     * @example
     * // Create many ExecutionRecords
     * const executionRecord = await prisma.executionRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExecutionRecordCreateManyArgs>(args?: SelectSubset<T, ExecutionRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExecutionRecords and returns the data saved in the database.
     * @param {ExecutionRecordCreateManyAndReturnArgs} args - Arguments to create many ExecutionRecords.
     * @example
     * // Create many ExecutionRecords
     * const executionRecord = await prisma.executionRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExecutionRecords and only return the `id`
     * const executionRecordWithIdOnly = await prisma.executionRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExecutionRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, ExecutionRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ExecutionRecord.
     * @param {ExecutionRecordDeleteArgs} args - Arguments to delete one ExecutionRecord.
     * @example
     * // Delete one ExecutionRecord
     * const ExecutionRecord = await prisma.executionRecord.delete({
     *   where: {
     *     // ... filter to delete one ExecutionRecord
     *   }
     * })
     * 
     */
    delete<T extends ExecutionRecordDeleteArgs>(args: SelectSubset<T, ExecutionRecordDeleteArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ExecutionRecord.
     * @param {ExecutionRecordUpdateArgs} args - Arguments to update one ExecutionRecord.
     * @example
     * // Update one ExecutionRecord
     * const executionRecord = await prisma.executionRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExecutionRecordUpdateArgs>(args: SelectSubset<T, ExecutionRecordUpdateArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ExecutionRecords.
     * @param {ExecutionRecordDeleteManyArgs} args - Arguments to filter ExecutionRecords to delete.
     * @example
     * // Delete a few ExecutionRecords
     * const { count } = await prisma.executionRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExecutionRecordDeleteManyArgs>(args?: SelectSubset<T, ExecutionRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExecutionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExecutionRecords
     * const executionRecord = await prisma.executionRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExecutionRecordUpdateManyArgs>(args: SelectSubset<T, ExecutionRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExecutionRecord.
     * @param {ExecutionRecordUpsertArgs} args - Arguments to update or create a ExecutionRecord.
     * @example
     * // Update or create a ExecutionRecord
     * const executionRecord = await prisma.executionRecord.upsert({
     *   create: {
     *     // ... data to create a ExecutionRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExecutionRecord we want to update
     *   }
     * })
     */
    upsert<T extends ExecutionRecordUpsertArgs>(args: SelectSubset<T, ExecutionRecordUpsertArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ExecutionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordCountArgs} args - Arguments to filter ExecutionRecords to count.
     * @example
     * // Count the number of ExecutionRecords
     * const count = await prisma.executionRecord.count({
     *   where: {
     *     // ... the filter for the ExecutionRecords we want to count
     *   }
     * })
    **/
    count<T extends ExecutionRecordCountArgs>(
      args?: Subset<T, ExecutionRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExecutionRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExecutionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExecutionRecordAggregateArgs>(args: Subset<T, ExecutionRecordAggregateArgs>): Prisma.PrismaPromise<GetExecutionRecordAggregateType<T>>

    /**
     * Group by ExecutionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExecutionRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExecutionRecordGroupByArgs['orderBy'] }
        : { orderBy?: ExecutionRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExecutionRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExecutionRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExecutionRecord model
   */
  readonly fields: ExecutionRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExecutionRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExecutionRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    technician<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    photos<T extends ExecutionRecord$photosArgs<ExtArgs> = {}>(args?: Subset<T, ExecutionRecord$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExecutionRecord model
   */ 
  interface ExecutionRecordFieldRefs {
    readonly id: FieldRef<"ExecutionRecord", 'String'>
    readonly orderId: FieldRef<"ExecutionRecord", 'String'>
    readonly technicianId: FieldRef<"ExecutionRecord", 'String'>
    readonly notes: FieldRef<"ExecutionRecord", 'String'>
    readonly idempotencyKey: FieldRef<"ExecutionRecord", 'String'>
    readonly payloadHash: FieldRef<"ExecutionRecord", 'String'>
    readonly submittedAt: FieldRef<"ExecutionRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExecutionRecord findUnique
   */
  export type ExecutionRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionRecord to fetch.
     */
    where: ExecutionRecordWhereUniqueInput
  }

  /**
   * ExecutionRecord findUniqueOrThrow
   */
  export type ExecutionRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionRecord to fetch.
     */
    where: ExecutionRecordWhereUniqueInput
  }

  /**
   * ExecutionRecord findFirst
   */
  export type ExecutionRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionRecord to fetch.
     */
    where?: ExecutionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionRecords to fetch.
     */
    orderBy?: ExecutionRecordOrderByWithRelationInput | ExecutionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExecutionRecords.
     */
    cursor?: ExecutionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExecutionRecords.
     */
    distinct?: ExecutionRecordScalarFieldEnum | ExecutionRecordScalarFieldEnum[]
  }

  /**
   * ExecutionRecord findFirstOrThrow
   */
  export type ExecutionRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionRecord to fetch.
     */
    where?: ExecutionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionRecords to fetch.
     */
    orderBy?: ExecutionRecordOrderByWithRelationInput | ExecutionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExecutionRecords.
     */
    cursor?: ExecutionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExecutionRecords.
     */
    distinct?: ExecutionRecordScalarFieldEnum | ExecutionRecordScalarFieldEnum[]
  }

  /**
   * ExecutionRecord findMany
   */
  export type ExecutionRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExecutionRecords to fetch.
     */
    where?: ExecutionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExecutionRecords to fetch.
     */
    orderBy?: ExecutionRecordOrderByWithRelationInput | ExecutionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExecutionRecords.
     */
    cursor?: ExecutionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExecutionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExecutionRecords.
     */
    skip?: number
    distinct?: ExecutionRecordScalarFieldEnum | ExecutionRecordScalarFieldEnum[]
  }

  /**
   * ExecutionRecord create
   */
  export type ExecutionRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a ExecutionRecord.
     */
    data: XOR<ExecutionRecordCreateInput, ExecutionRecordUncheckedCreateInput>
  }

  /**
   * ExecutionRecord createMany
   */
  export type ExecutionRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExecutionRecords.
     */
    data: ExecutionRecordCreateManyInput | ExecutionRecordCreateManyInput[]
  }

  /**
   * ExecutionRecord createManyAndReturn
   */
  export type ExecutionRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ExecutionRecords.
     */
    data: ExecutionRecordCreateManyInput | ExecutionRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExecutionRecord update
   */
  export type ExecutionRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a ExecutionRecord.
     */
    data: XOR<ExecutionRecordUpdateInput, ExecutionRecordUncheckedUpdateInput>
    /**
     * Choose, which ExecutionRecord to update.
     */
    where: ExecutionRecordWhereUniqueInput
  }

  /**
   * ExecutionRecord updateMany
   */
  export type ExecutionRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExecutionRecords.
     */
    data: XOR<ExecutionRecordUpdateManyMutationInput, ExecutionRecordUncheckedUpdateManyInput>
    /**
     * Filter which ExecutionRecords to update
     */
    where?: ExecutionRecordWhereInput
  }

  /**
   * ExecutionRecord upsert
   */
  export type ExecutionRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the ExecutionRecord to update in case it exists.
     */
    where: ExecutionRecordWhereUniqueInput
    /**
     * In case the ExecutionRecord found by the `where` argument doesn't exist, create a new ExecutionRecord with this data.
     */
    create: XOR<ExecutionRecordCreateInput, ExecutionRecordUncheckedCreateInput>
    /**
     * In case the ExecutionRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExecutionRecordUpdateInput, ExecutionRecordUncheckedUpdateInput>
  }

  /**
   * ExecutionRecord delete
   */
  export type ExecutionRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
    /**
     * Filter which ExecutionRecord to delete.
     */
    where: ExecutionRecordWhereUniqueInput
  }

  /**
   * ExecutionRecord deleteMany
   */
  export type ExecutionRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExecutionRecords to delete
     */
    where?: ExecutionRecordWhereInput
  }

  /**
   * ExecutionRecord.photos
   */
  export type ExecutionRecord$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    where?: EvidencePhotoWhereInput
    orderBy?: EvidencePhotoOrderByWithRelationInput | EvidencePhotoOrderByWithRelationInput[]
    cursor?: EvidencePhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvidencePhotoScalarFieldEnum | EvidencePhotoScalarFieldEnum[]
  }

  /**
   * ExecutionRecord without action
   */
  export type ExecutionRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionRecord
     */
    select?: ExecutionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionRecordInclude<ExtArgs> | null
  }


  /**
   * Model EvidencePhoto
   */

  export type AggregateEvidencePhoto = {
    _count: EvidencePhotoCountAggregateOutputType | null
    _avg: EvidencePhotoAvgAggregateOutputType | null
    _sum: EvidencePhotoSumAggregateOutputType | null
    _min: EvidencePhotoMinAggregateOutputType | null
    _max: EvidencePhotoMaxAggregateOutputType | null
  }

  export type EvidencePhotoAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type EvidencePhotoSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type EvidencePhotoMinAggregateOutputType = {
    id: string | null
    executionRecordId: string | null
    mimeType: string | null
    storageKey: string | null
    sizeBytes: number | null
    uploadedAt: Date | null
    retentionExpiresAt: Date | null
  }

  export type EvidencePhotoMaxAggregateOutputType = {
    id: string | null
    executionRecordId: string | null
    mimeType: string | null
    storageKey: string | null
    sizeBytes: number | null
    uploadedAt: Date | null
    retentionExpiresAt: Date | null
  }

  export type EvidencePhotoCountAggregateOutputType = {
    id: number
    executionRecordId: number
    mimeType: number
    storageKey: number
    sizeBytes: number
    uploadedAt: number
    retentionExpiresAt: number
    _all: number
  }


  export type EvidencePhotoAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type EvidencePhotoSumAggregateInputType = {
    sizeBytes?: true
  }

  export type EvidencePhotoMinAggregateInputType = {
    id?: true
    executionRecordId?: true
    mimeType?: true
    storageKey?: true
    sizeBytes?: true
    uploadedAt?: true
    retentionExpiresAt?: true
  }

  export type EvidencePhotoMaxAggregateInputType = {
    id?: true
    executionRecordId?: true
    mimeType?: true
    storageKey?: true
    sizeBytes?: true
    uploadedAt?: true
    retentionExpiresAt?: true
  }

  export type EvidencePhotoCountAggregateInputType = {
    id?: true
    executionRecordId?: true
    mimeType?: true
    storageKey?: true
    sizeBytes?: true
    uploadedAt?: true
    retentionExpiresAt?: true
    _all?: true
  }

  export type EvidencePhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvidencePhoto to aggregate.
     */
    where?: EvidencePhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidencePhotos to fetch.
     */
    orderBy?: EvidencePhotoOrderByWithRelationInput | EvidencePhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvidencePhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidencePhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidencePhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EvidencePhotos
    **/
    _count?: true | EvidencePhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EvidencePhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EvidencePhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvidencePhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvidencePhotoMaxAggregateInputType
  }

  export type GetEvidencePhotoAggregateType<T extends EvidencePhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateEvidencePhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvidencePhoto[P]>
      : GetScalarType<T[P], AggregateEvidencePhoto[P]>
  }




  export type EvidencePhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvidencePhotoWhereInput
    orderBy?: EvidencePhotoOrderByWithAggregationInput | EvidencePhotoOrderByWithAggregationInput[]
    by: EvidencePhotoScalarFieldEnum[] | EvidencePhotoScalarFieldEnum
    having?: EvidencePhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvidencePhotoCountAggregateInputType | true
    _avg?: EvidencePhotoAvgAggregateInputType
    _sum?: EvidencePhotoSumAggregateInputType
    _min?: EvidencePhotoMinAggregateInputType
    _max?: EvidencePhotoMaxAggregateInputType
  }

  export type EvidencePhotoGroupByOutputType = {
    id: string
    executionRecordId: string
    mimeType: string
    storageKey: string | null
    sizeBytes: number
    uploadedAt: Date
    retentionExpiresAt: Date
    _count: EvidencePhotoCountAggregateOutputType | null
    _avg: EvidencePhotoAvgAggregateOutputType | null
    _sum: EvidencePhotoSumAggregateOutputType | null
    _min: EvidencePhotoMinAggregateOutputType | null
    _max: EvidencePhotoMaxAggregateOutputType | null
  }

  type GetEvidencePhotoGroupByPayload<T extends EvidencePhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvidencePhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvidencePhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvidencePhotoGroupByOutputType[P]>
            : GetScalarType<T[P], EvidencePhotoGroupByOutputType[P]>
        }
      >
    >


  export type EvidencePhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    executionRecordId?: boolean
    mimeType?: boolean
    storageKey?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
    retentionExpiresAt?: boolean
    executionRecord?: boolean | ExecutionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidencePhoto"]>

  export type EvidencePhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    executionRecordId?: boolean
    mimeType?: boolean
    storageKey?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
    retentionExpiresAt?: boolean
    executionRecord?: boolean | ExecutionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidencePhoto"]>

  export type EvidencePhotoSelectScalar = {
    id?: boolean
    executionRecordId?: boolean
    mimeType?: boolean
    storageKey?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
    retentionExpiresAt?: boolean
  }

  export type EvidencePhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    executionRecord?: boolean | ExecutionRecordDefaultArgs<ExtArgs>
  }
  export type EvidencePhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    executionRecord?: boolean | ExecutionRecordDefaultArgs<ExtArgs>
  }

  export type $EvidencePhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EvidencePhoto"
    objects: {
      executionRecord: Prisma.$ExecutionRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      executionRecordId: string
      mimeType: string
      storageKey: string | null
      sizeBytes: number
      uploadedAt: Date
      retentionExpiresAt: Date
    }, ExtArgs["result"]["evidencePhoto"]>
    composites: {}
  }

  type EvidencePhotoGetPayload<S extends boolean | null | undefined | EvidencePhotoDefaultArgs> = $Result.GetResult<Prisma.$EvidencePhotoPayload, S>

  type EvidencePhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EvidencePhotoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EvidencePhotoCountAggregateInputType | true
    }

  export interface EvidencePhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EvidencePhoto'], meta: { name: 'EvidencePhoto' } }
    /**
     * Find zero or one EvidencePhoto that matches the filter.
     * @param {EvidencePhotoFindUniqueArgs} args - Arguments to find a EvidencePhoto
     * @example
     * // Get one EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvidencePhotoFindUniqueArgs>(args: SelectSubset<T, EvidencePhotoFindUniqueArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EvidencePhoto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EvidencePhotoFindUniqueOrThrowArgs} args - Arguments to find a EvidencePhoto
     * @example
     * // Get one EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvidencePhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, EvidencePhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EvidencePhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoFindFirstArgs} args - Arguments to find a EvidencePhoto
     * @example
     * // Get one EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvidencePhotoFindFirstArgs>(args?: SelectSubset<T, EvidencePhotoFindFirstArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EvidencePhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoFindFirstOrThrowArgs} args - Arguments to find a EvidencePhoto
     * @example
     * // Get one EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvidencePhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, EvidencePhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EvidencePhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EvidencePhotos
     * const evidencePhotos = await prisma.evidencePhoto.findMany()
     * 
     * // Get first 10 EvidencePhotos
     * const evidencePhotos = await prisma.evidencePhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evidencePhotoWithIdOnly = await prisma.evidencePhoto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvidencePhotoFindManyArgs>(args?: SelectSubset<T, EvidencePhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EvidencePhoto.
     * @param {EvidencePhotoCreateArgs} args - Arguments to create a EvidencePhoto.
     * @example
     * // Create one EvidencePhoto
     * const EvidencePhoto = await prisma.evidencePhoto.create({
     *   data: {
     *     // ... data to create a EvidencePhoto
     *   }
     * })
     * 
     */
    create<T extends EvidencePhotoCreateArgs>(args: SelectSubset<T, EvidencePhotoCreateArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EvidencePhotos.
     * @param {EvidencePhotoCreateManyArgs} args - Arguments to create many EvidencePhotos.
     * @example
     * // Create many EvidencePhotos
     * const evidencePhoto = await prisma.evidencePhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvidencePhotoCreateManyArgs>(args?: SelectSubset<T, EvidencePhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EvidencePhotos and returns the data saved in the database.
     * @param {EvidencePhotoCreateManyAndReturnArgs} args - Arguments to create many EvidencePhotos.
     * @example
     * // Create many EvidencePhotos
     * const evidencePhoto = await prisma.evidencePhoto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EvidencePhotos and only return the `id`
     * const evidencePhotoWithIdOnly = await prisma.evidencePhoto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvidencePhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, EvidencePhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EvidencePhoto.
     * @param {EvidencePhotoDeleteArgs} args - Arguments to delete one EvidencePhoto.
     * @example
     * // Delete one EvidencePhoto
     * const EvidencePhoto = await prisma.evidencePhoto.delete({
     *   where: {
     *     // ... filter to delete one EvidencePhoto
     *   }
     * })
     * 
     */
    delete<T extends EvidencePhotoDeleteArgs>(args: SelectSubset<T, EvidencePhotoDeleteArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EvidencePhoto.
     * @param {EvidencePhotoUpdateArgs} args - Arguments to update one EvidencePhoto.
     * @example
     * // Update one EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvidencePhotoUpdateArgs>(args: SelectSubset<T, EvidencePhotoUpdateArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EvidencePhotos.
     * @param {EvidencePhotoDeleteManyArgs} args - Arguments to filter EvidencePhotos to delete.
     * @example
     * // Delete a few EvidencePhotos
     * const { count } = await prisma.evidencePhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvidencePhotoDeleteManyArgs>(args?: SelectSubset<T, EvidencePhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvidencePhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EvidencePhotos
     * const evidencePhoto = await prisma.evidencePhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvidencePhotoUpdateManyArgs>(args: SelectSubset<T, EvidencePhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EvidencePhoto.
     * @param {EvidencePhotoUpsertArgs} args - Arguments to update or create a EvidencePhoto.
     * @example
     * // Update or create a EvidencePhoto
     * const evidencePhoto = await prisma.evidencePhoto.upsert({
     *   create: {
     *     // ... data to create a EvidencePhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EvidencePhoto we want to update
     *   }
     * })
     */
    upsert<T extends EvidencePhotoUpsertArgs>(args: SelectSubset<T, EvidencePhotoUpsertArgs<ExtArgs>>): Prisma__EvidencePhotoClient<$Result.GetResult<Prisma.$EvidencePhotoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EvidencePhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoCountArgs} args - Arguments to filter EvidencePhotos to count.
     * @example
     * // Count the number of EvidencePhotos
     * const count = await prisma.evidencePhoto.count({
     *   where: {
     *     // ... the filter for the EvidencePhotos we want to count
     *   }
     * })
    **/
    count<T extends EvidencePhotoCountArgs>(
      args?: Subset<T, EvidencePhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvidencePhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EvidencePhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EvidencePhotoAggregateArgs>(args: Subset<T, EvidencePhotoAggregateArgs>): Prisma.PrismaPromise<GetEvidencePhotoAggregateType<T>>

    /**
     * Group by EvidencePhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidencePhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EvidencePhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvidencePhotoGroupByArgs['orderBy'] }
        : { orderBy?: EvidencePhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EvidencePhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvidencePhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EvidencePhoto model
   */
  readonly fields: EvidencePhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EvidencePhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvidencePhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    executionRecord<T extends ExecutionRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExecutionRecordDefaultArgs<ExtArgs>>): Prisma__ExecutionRecordClient<$Result.GetResult<Prisma.$ExecutionRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EvidencePhoto model
   */ 
  interface EvidencePhotoFieldRefs {
    readonly id: FieldRef<"EvidencePhoto", 'String'>
    readonly executionRecordId: FieldRef<"EvidencePhoto", 'String'>
    readonly mimeType: FieldRef<"EvidencePhoto", 'String'>
    readonly storageKey: FieldRef<"EvidencePhoto", 'String'>
    readonly sizeBytes: FieldRef<"EvidencePhoto", 'Int'>
    readonly uploadedAt: FieldRef<"EvidencePhoto", 'DateTime'>
    readonly retentionExpiresAt: FieldRef<"EvidencePhoto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EvidencePhoto findUnique
   */
  export type EvidencePhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter, which EvidencePhoto to fetch.
     */
    where: EvidencePhotoWhereUniqueInput
  }

  /**
   * EvidencePhoto findUniqueOrThrow
   */
  export type EvidencePhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter, which EvidencePhoto to fetch.
     */
    where: EvidencePhotoWhereUniqueInput
  }

  /**
   * EvidencePhoto findFirst
   */
  export type EvidencePhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter, which EvidencePhoto to fetch.
     */
    where?: EvidencePhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidencePhotos to fetch.
     */
    orderBy?: EvidencePhotoOrderByWithRelationInput | EvidencePhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvidencePhotos.
     */
    cursor?: EvidencePhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidencePhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidencePhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvidencePhotos.
     */
    distinct?: EvidencePhotoScalarFieldEnum | EvidencePhotoScalarFieldEnum[]
  }

  /**
   * EvidencePhoto findFirstOrThrow
   */
  export type EvidencePhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter, which EvidencePhoto to fetch.
     */
    where?: EvidencePhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidencePhotos to fetch.
     */
    orderBy?: EvidencePhotoOrderByWithRelationInput | EvidencePhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvidencePhotos.
     */
    cursor?: EvidencePhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidencePhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidencePhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvidencePhotos.
     */
    distinct?: EvidencePhotoScalarFieldEnum | EvidencePhotoScalarFieldEnum[]
  }

  /**
   * EvidencePhoto findMany
   */
  export type EvidencePhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter, which EvidencePhotos to fetch.
     */
    where?: EvidencePhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidencePhotos to fetch.
     */
    orderBy?: EvidencePhotoOrderByWithRelationInput | EvidencePhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EvidencePhotos.
     */
    cursor?: EvidencePhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidencePhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidencePhotos.
     */
    skip?: number
    distinct?: EvidencePhotoScalarFieldEnum | EvidencePhotoScalarFieldEnum[]
  }

  /**
   * EvidencePhoto create
   */
  export type EvidencePhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a EvidencePhoto.
     */
    data: XOR<EvidencePhotoCreateInput, EvidencePhotoUncheckedCreateInput>
  }

  /**
   * EvidencePhoto createMany
   */
  export type EvidencePhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EvidencePhotos.
     */
    data: EvidencePhotoCreateManyInput | EvidencePhotoCreateManyInput[]
  }

  /**
   * EvidencePhoto createManyAndReturn
   */
  export type EvidencePhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EvidencePhotos.
     */
    data: EvidencePhotoCreateManyInput | EvidencePhotoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvidencePhoto update
   */
  export type EvidencePhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a EvidencePhoto.
     */
    data: XOR<EvidencePhotoUpdateInput, EvidencePhotoUncheckedUpdateInput>
    /**
     * Choose, which EvidencePhoto to update.
     */
    where: EvidencePhotoWhereUniqueInput
  }

  /**
   * EvidencePhoto updateMany
   */
  export type EvidencePhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EvidencePhotos.
     */
    data: XOR<EvidencePhotoUpdateManyMutationInput, EvidencePhotoUncheckedUpdateManyInput>
    /**
     * Filter which EvidencePhotos to update
     */
    where?: EvidencePhotoWhereInput
  }

  /**
   * EvidencePhoto upsert
   */
  export type EvidencePhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the EvidencePhoto to update in case it exists.
     */
    where: EvidencePhotoWhereUniqueInput
    /**
     * In case the EvidencePhoto found by the `where` argument doesn't exist, create a new EvidencePhoto with this data.
     */
    create: XOR<EvidencePhotoCreateInput, EvidencePhotoUncheckedCreateInput>
    /**
     * In case the EvidencePhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvidencePhotoUpdateInput, EvidencePhotoUncheckedUpdateInput>
  }

  /**
   * EvidencePhoto delete
   */
  export type EvidencePhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
    /**
     * Filter which EvidencePhoto to delete.
     */
    where: EvidencePhotoWhereUniqueInput
  }

  /**
   * EvidencePhoto deleteMany
   */
  export type EvidencePhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvidencePhotos to delete
     */
    where?: EvidencePhotoWhereInput
  }

  /**
   * EvidencePhoto without action
   */
  export type EvidencePhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidencePhoto
     */
    select?: EvidencePhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidencePhotoInclude<ExtArgs> | null
  }


  /**
   * Model AuditLogEntry
   */

  export type AggregateAuditLogEntry = {
    _count: AuditLogEntryCountAggregateOutputType | null
    _min: AuditLogEntryMinAggregateOutputType | null
    _max: AuditLogEntryMaxAggregateOutputType | null
  }

  export type AuditLogEntryMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    actorUserId: string | null
    action: string | null
    timestamp: Date | null
    metadata: string | null
    retentionExpiresAt: Date | null
  }

  export type AuditLogEntryMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    actorUserId: string | null
    action: string | null
    timestamp: Date | null
    metadata: string | null
    retentionExpiresAt: Date | null
  }

  export type AuditLogEntryCountAggregateOutputType = {
    id: number
    orderId: number
    actorUserId: number
    action: number
    timestamp: number
    metadata: number
    retentionExpiresAt: number
    _all: number
  }


  export type AuditLogEntryMinAggregateInputType = {
    id?: true
    orderId?: true
    actorUserId?: true
    action?: true
    timestamp?: true
    metadata?: true
    retentionExpiresAt?: true
  }

  export type AuditLogEntryMaxAggregateInputType = {
    id?: true
    orderId?: true
    actorUserId?: true
    action?: true
    timestamp?: true
    metadata?: true
    retentionExpiresAt?: true
  }

  export type AuditLogEntryCountAggregateInputType = {
    id?: true
    orderId?: true
    actorUserId?: true
    action?: true
    timestamp?: true
    metadata?: true
    retentionExpiresAt?: true
    _all?: true
  }

  export type AuditLogEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogEntry to aggregate.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogEntries
    **/
    _count?: true | AuditLogEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogEntryMaxAggregateInputType
  }

  export type GetAuditLogEntryAggregateType<T extends AuditLogEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLogEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLogEntry[P]>
      : GetScalarType<T[P], AggregateAuditLogEntry[P]>
  }




  export type AuditLogEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogEntryWhereInput
    orderBy?: AuditLogEntryOrderByWithAggregationInput | AuditLogEntryOrderByWithAggregationInput[]
    by: AuditLogEntryScalarFieldEnum[] | AuditLogEntryScalarFieldEnum
    having?: AuditLogEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogEntryCountAggregateInputType | true
    _min?: AuditLogEntryMinAggregateInputType
    _max?: AuditLogEntryMaxAggregateInputType
  }

  export type AuditLogEntryGroupByOutputType = {
    id: string
    orderId: string
    actorUserId: string
    action: string
    timestamp: Date
    metadata: string | null
    retentionExpiresAt: Date
    _count: AuditLogEntryCountAggregateOutputType | null
    _min: AuditLogEntryMinAggregateOutputType | null
    _max: AuditLogEntryMaxAggregateOutputType | null
  }

  type GetAuditLogEntryGroupByPayload<T extends AuditLogEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogEntryGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogEntryGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    actorUserId?: boolean
    action?: boolean
    timestamp?: boolean
    metadata?: boolean
    retentionExpiresAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLogEntry"]>

  export type AuditLogEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    actorUserId?: boolean
    action?: boolean
    timestamp?: boolean
    metadata?: boolean
    retentionExpiresAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLogEntry"]>

  export type AuditLogEntrySelectScalar = {
    id?: boolean
    orderId?: boolean
    actorUserId?: boolean
    action?: boolean
    timestamp?: boolean
    metadata?: boolean
    retentionExpiresAt?: boolean
  }

  export type AuditLogEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLogEntry"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      actor: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      actorUserId: string
      action: string
      timestamp: Date
      metadata: string | null
      retentionExpiresAt: Date
    }, ExtArgs["result"]["auditLogEntry"]>
    composites: {}
  }

  type AuditLogEntryGetPayload<S extends boolean | null | undefined | AuditLogEntryDefaultArgs> = $Result.GetResult<Prisma.$AuditLogEntryPayload, S>

  type AuditLogEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogEntryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogEntryCountAggregateInputType | true
    }

  export interface AuditLogEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLogEntry'], meta: { name: 'AuditLogEntry' } }
    /**
     * Find zero or one AuditLogEntry that matches the filter.
     * @param {AuditLogEntryFindUniqueArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogEntryFindUniqueArgs>(args: SelectSubset<T, AuditLogEntryFindUniqueArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLogEntry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogEntryFindUniqueOrThrowArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLogEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindFirstArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogEntryFindFirstArgs>(args?: SelectSubset<T, AuditLogEntryFindFirstArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLogEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindFirstOrThrowArgs} args - Arguments to find a AuditLogEntry
     * @example
     * // Get one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogEntries
     * const auditLogEntries = await prisma.auditLogEntry.findMany()
     * 
     * // Get first 10 AuditLogEntries
     * const auditLogEntries = await prisma.auditLogEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogEntryWithIdOnly = await prisma.auditLogEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogEntryFindManyArgs>(args?: SelectSubset<T, AuditLogEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLogEntry.
     * @param {AuditLogEntryCreateArgs} args - Arguments to create a AuditLogEntry.
     * @example
     * // Create one AuditLogEntry
     * const AuditLogEntry = await prisma.auditLogEntry.create({
     *   data: {
     *     // ... data to create a AuditLogEntry
     *   }
     * })
     * 
     */
    create<T extends AuditLogEntryCreateArgs>(args: SelectSubset<T, AuditLogEntryCreateArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogEntries.
     * @param {AuditLogEntryCreateManyArgs} args - Arguments to create many AuditLogEntries.
     * @example
     * // Create many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogEntryCreateManyArgs>(args?: SelectSubset<T, AuditLogEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogEntries and returns the data saved in the database.
     * @param {AuditLogEntryCreateManyAndReturnArgs} args - Arguments to create many AuditLogEntries.
     * @example
     * // Create many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogEntries and only return the `id`
     * const auditLogEntryWithIdOnly = await prisma.auditLogEntry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLogEntry.
     * @param {AuditLogEntryDeleteArgs} args - Arguments to delete one AuditLogEntry.
     * @example
     * // Delete one AuditLogEntry
     * const AuditLogEntry = await prisma.auditLogEntry.delete({
     *   where: {
     *     // ... filter to delete one AuditLogEntry
     *   }
     * })
     * 
     */
    delete<T extends AuditLogEntryDeleteArgs>(args: SelectSubset<T, AuditLogEntryDeleteArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLogEntry.
     * @param {AuditLogEntryUpdateArgs} args - Arguments to update one AuditLogEntry.
     * @example
     * // Update one AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogEntryUpdateArgs>(args: SelectSubset<T, AuditLogEntryUpdateArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogEntries.
     * @param {AuditLogEntryDeleteManyArgs} args - Arguments to filter AuditLogEntries to delete.
     * @example
     * // Delete a few AuditLogEntries
     * const { count } = await prisma.auditLogEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogEntryDeleteManyArgs>(args?: SelectSubset<T, AuditLogEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogEntries
     * const auditLogEntry = await prisma.auditLogEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogEntryUpdateManyArgs>(args: SelectSubset<T, AuditLogEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLogEntry.
     * @param {AuditLogEntryUpsertArgs} args - Arguments to update or create a AuditLogEntry.
     * @example
     * // Update or create a AuditLogEntry
     * const auditLogEntry = await prisma.auditLogEntry.upsert({
     *   create: {
     *     // ... data to create a AuditLogEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLogEntry we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogEntryUpsertArgs>(args: SelectSubset<T, AuditLogEntryUpsertArgs<ExtArgs>>): Prisma__AuditLogEntryClient<$Result.GetResult<Prisma.$AuditLogEntryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryCountArgs} args - Arguments to filter AuditLogEntries to count.
     * @example
     * // Count the number of AuditLogEntries
     * const count = await prisma.auditLogEntry.count({
     *   where: {
     *     // ... the filter for the AuditLogEntries we want to count
     *   }
     * })
    **/
    count<T extends AuditLogEntryCountArgs>(
      args?: Subset<T, AuditLogEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLogEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogEntryAggregateArgs>(args: Subset<T, AuditLogEntryAggregateArgs>): Prisma.PrismaPromise<GetAuditLogEntryAggregateType<T>>

    /**
     * Group by AuditLogEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogEntryGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLogEntry model
   */
  readonly fields: AuditLogEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLogEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    actor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLogEntry model
   */ 
  interface AuditLogEntryFieldRefs {
    readonly id: FieldRef<"AuditLogEntry", 'String'>
    readonly orderId: FieldRef<"AuditLogEntry", 'String'>
    readonly actorUserId: FieldRef<"AuditLogEntry", 'String'>
    readonly action: FieldRef<"AuditLogEntry", 'String'>
    readonly timestamp: FieldRef<"AuditLogEntry", 'DateTime'>
    readonly metadata: FieldRef<"AuditLogEntry", 'String'>
    readonly retentionExpiresAt: FieldRef<"AuditLogEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLogEntry findUnique
   */
  export type AuditLogEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry findUniqueOrThrow
   */
  export type AuditLogEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry findFirst
   */
  export type AuditLogEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogEntries.
     */
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry findFirstOrThrow
   */
  export type AuditLogEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogEntry to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogEntries.
     */
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry findMany
   */
  export type AuditLogEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogEntries to fetch.
     */
    where?: AuditLogEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogEntries to fetch.
     */
    orderBy?: AuditLogEntryOrderByWithRelationInput | AuditLogEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogEntries.
     */
    cursor?: AuditLogEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogEntries.
     */
    skip?: number
    distinct?: AuditLogEntryScalarFieldEnum | AuditLogEntryScalarFieldEnum[]
  }

  /**
   * AuditLogEntry create
   */
  export type AuditLogEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLogEntry.
     */
    data: XOR<AuditLogEntryCreateInput, AuditLogEntryUncheckedCreateInput>
  }

  /**
   * AuditLogEntry createMany
   */
  export type AuditLogEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogEntries.
     */
    data: AuditLogEntryCreateManyInput | AuditLogEntryCreateManyInput[]
  }

  /**
   * AuditLogEntry createManyAndReturn
   */
  export type AuditLogEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogEntries.
     */
    data: AuditLogEntryCreateManyInput | AuditLogEntryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLogEntry update
   */
  export type AuditLogEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLogEntry.
     */
    data: XOR<AuditLogEntryUpdateInput, AuditLogEntryUncheckedUpdateInput>
    /**
     * Choose, which AuditLogEntry to update.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry updateMany
   */
  export type AuditLogEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogEntries.
     */
    data: XOR<AuditLogEntryUpdateManyMutationInput, AuditLogEntryUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogEntries to update
     */
    where?: AuditLogEntryWhereInput
  }

  /**
   * AuditLogEntry upsert
   */
  export type AuditLogEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLogEntry to update in case it exists.
     */
    where: AuditLogEntryWhereUniqueInput
    /**
     * In case the AuditLogEntry found by the `where` argument doesn't exist, create a new AuditLogEntry with this data.
     */
    create: XOR<AuditLogEntryCreateInput, AuditLogEntryUncheckedCreateInput>
    /**
     * In case the AuditLogEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogEntryUpdateInput, AuditLogEntryUncheckedUpdateInput>
  }

  /**
   * AuditLogEntry delete
   */
  export type AuditLogEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
    /**
     * Filter which AuditLogEntry to delete.
     */
    where: AuditLogEntryWhereUniqueInput
  }

  /**
   * AuditLogEntry deleteMany
   */
  export type AuditLogEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogEntries to delete
     */
    where?: AuditLogEntryWhereInput
  }

  /**
   * AuditLogEntry without action
   */
  export type AuditLogEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogEntry
     */
    select?: AuditLogEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogEntryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    role: 'role',
    activo: 'activo',
    nombre: 'nombre',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RevokedRefreshTokenScalarFieldEnum: {
    jti: 'jti',
    userId: 'userId',
    revokedAt: 'revokedAt',
    expiresAt: 'expiresAt'
  };

  export type RevokedRefreshTokenScalarFieldEnum = (typeof RevokedRefreshTokenScalarFieldEnum)[keyof typeof RevokedRefreshTokenScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    status: 'status',
    clientId: 'clientId',
    technicianId: 'technicianId',
    version: 'version',
    rejectionReason: 'rejectionReason',
    resolvedByUserId: 'resolvedByUserId',
    createdAt: 'createdAt',
    assignedAt: 'assignedAt',
    submittedAt: 'submittedAt',
    resolvedAt: 'resolvedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const ExecutionRecordScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    technicianId: 'technicianId',
    notes: 'notes',
    idempotencyKey: 'idempotencyKey',
    payloadHash: 'payloadHash',
    submittedAt: 'submittedAt'
  };

  export type ExecutionRecordScalarFieldEnum = (typeof ExecutionRecordScalarFieldEnum)[keyof typeof ExecutionRecordScalarFieldEnum]


  export const EvidencePhotoScalarFieldEnum: {
    id: 'id',
    executionRecordId: 'executionRecordId',
    mimeType: 'mimeType',
    storageKey: 'storageKey',
    sizeBytes: 'sizeBytes',
    uploadedAt: 'uploadedAt',
    retentionExpiresAt: 'retentionExpiresAt'
  };

  export type EvidencePhotoScalarFieldEnum = (typeof EvidencePhotoScalarFieldEnum)[keyof typeof EvidencePhotoScalarFieldEnum]


  export const AuditLogEntryScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    actorUserId: 'actorUserId',
    action: 'action',
    timestamp: 'timestamp',
    metadata: 'metadata',
    retentionExpiresAt: 'retentionExpiresAt'
  };

  export type AuditLogEntryScalarFieldEnum = (typeof AuditLogEntryScalarFieldEnum)[keyof typeof AuditLogEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    activo?: BoolFilter<"User"> | boolean
    nombre?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    ordersAsClient?: OrderListRelationFilter
    ordersAsTechnician?: OrderListRelationFilter
    executionRecords?: ExecutionRecordListRelationFilter
    auditLogEntries?: AuditLogEntryListRelationFilter
    resolvedOrders?: OrderListRelationFilter
    revokedRefreshTokens?: RevokedRefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    activo?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    ordersAsClient?: OrderOrderByRelationAggregateInput
    ordersAsTechnician?: OrderOrderByRelationAggregateInput
    executionRecords?: ExecutionRecordOrderByRelationAggregateInput
    auditLogEntries?: AuditLogEntryOrderByRelationAggregateInput
    resolvedOrders?: OrderOrderByRelationAggregateInput
    revokedRefreshTokens?: RevokedRefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: StringFilter<"User"> | string
    activo?: BoolFilter<"User"> | boolean
    nombre?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    ordersAsClient?: OrderListRelationFilter
    ordersAsTechnician?: OrderListRelationFilter
    executionRecords?: ExecutionRecordListRelationFilter
    auditLogEntries?: AuditLogEntryListRelationFilter
    resolvedOrders?: OrderListRelationFilter
    revokedRefreshTokens?: RevokedRefreshTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    activo?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    activo?: BoolWithAggregatesFilter<"User"> | boolean
    nombre?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RevokedRefreshTokenWhereInput = {
    AND?: RevokedRefreshTokenWhereInput | RevokedRefreshTokenWhereInput[]
    OR?: RevokedRefreshTokenWhereInput[]
    NOT?: RevokedRefreshTokenWhereInput | RevokedRefreshTokenWhereInput[]
    jti?: StringFilter<"RevokedRefreshToken"> | string
    userId?: StringFilter<"RevokedRefreshToken"> | string
    revokedAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
    expiresAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type RevokedRefreshTokenOrderByWithRelationInput = {
    jti?: SortOrder
    userId?: SortOrder
    revokedAt?: SortOrder
    expiresAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RevokedRefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    jti?: string
    AND?: RevokedRefreshTokenWhereInput | RevokedRefreshTokenWhereInput[]
    OR?: RevokedRefreshTokenWhereInput[]
    NOT?: RevokedRefreshTokenWhereInput | RevokedRefreshTokenWhereInput[]
    userId?: StringFilter<"RevokedRefreshToken"> | string
    revokedAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
    expiresAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "jti">

  export type RevokedRefreshTokenOrderByWithAggregationInput = {
    jti?: SortOrder
    userId?: SortOrder
    revokedAt?: SortOrder
    expiresAt?: SortOrder
    _count?: RevokedRefreshTokenCountOrderByAggregateInput
    _max?: RevokedRefreshTokenMaxOrderByAggregateInput
    _min?: RevokedRefreshTokenMinOrderByAggregateInput
  }

  export type RevokedRefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RevokedRefreshTokenScalarWhereWithAggregatesInput | RevokedRefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RevokedRefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RevokedRefreshTokenScalarWhereWithAggregatesInput | RevokedRefreshTokenScalarWhereWithAggregatesInput[]
    jti?: StringWithAggregatesFilter<"RevokedRefreshToken"> | string
    userId?: StringWithAggregatesFilter<"RevokedRefreshToken"> | string
    revokedAt?: DateTimeWithAggregatesFilter<"RevokedRefreshToken"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"RevokedRefreshToken"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    status?: StringFilter<"Order"> | string
    clientId?: StringFilter<"Order"> | string
    technicianId?: StringNullableFilter<"Order"> | string | null
    version?: IntFilter<"Order"> | number
    rejectionReason?: StringNullableFilter<"Order"> | string | null
    resolvedByUserId?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    assignedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    submittedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    client?: XOR<UserRelationFilter, UserWhereInput>
    technician?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    resolvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    executionRecord?: XOR<ExecutionRecordNullableRelationFilter, ExecutionRecordWhereInput> | null
    auditLogEntries?: AuditLogEntryListRelationFilter
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    clientId?: SortOrder
    technicianId?: SortOrderInput | SortOrder
    version?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    resolvedByUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    assignedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    client?: UserOrderByWithRelationInput
    technician?: UserOrderByWithRelationInput
    resolvedBy?: UserOrderByWithRelationInput
    executionRecord?: ExecutionRecordOrderByWithRelationInput
    auditLogEntries?: AuditLogEntryOrderByRelationAggregateInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    status?: StringFilter<"Order"> | string
    clientId?: StringFilter<"Order"> | string
    technicianId?: StringNullableFilter<"Order"> | string | null
    version?: IntFilter<"Order"> | number
    rejectionReason?: StringNullableFilter<"Order"> | string | null
    resolvedByUserId?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    assignedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    submittedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    client?: XOR<UserRelationFilter, UserWhereInput>
    technician?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    resolvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    executionRecord?: XOR<ExecutionRecordNullableRelationFilter, ExecutionRecordWhereInput> | null
    auditLogEntries?: AuditLogEntryListRelationFilter
  }, "id">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    clientId?: SortOrder
    technicianId?: SortOrderInput | SortOrder
    version?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    resolvedByUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    assignedAt?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    status?: StringWithAggregatesFilter<"Order"> | string
    clientId?: StringWithAggregatesFilter<"Order"> | string
    technicianId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    version?: IntWithAggregatesFilter<"Order"> | number
    rejectionReason?: StringNullableWithAggregatesFilter<"Order"> | string | null
    resolvedByUserId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    assignedAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    submittedAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
  }

  export type ExecutionRecordWhereInput = {
    AND?: ExecutionRecordWhereInput | ExecutionRecordWhereInput[]
    OR?: ExecutionRecordWhereInput[]
    NOT?: ExecutionRecordWhereInput | ExecutionRecordWhereInput[]
    id?: StringFilter<"ExecutionRecord"> | string
    orderId?: StringFilter<"ExecutionRecord"> | string
    technicianId?: StringFilter<"ExecutionRecord"> | string
    notes?: StringFilter<"ExecutionRecord"> | string
    idempotencyKey?: StringFilter<"ExecutionRecord"> | string
    payloadHash?: StringFilter<"ExecutionRecord"> | string
    submittedAt?: DateTimeFilter<"ExecutionRecord"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    technician?: XOR<UserRelationFilter, UserWhereInput>
    photos?: EvidencePhotoListRelationFilter
  }

  export type ExecutionRecordOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    technicianId?: SortOrder
    notes?: SortOrder
    idempotencyKey?: SortOrder
    payloadHash?: SortOrder
    submittedAt?: SortOrder
    order?: OrderOrderByWithRelationInput
    technician?: UserOrderByWithRelationInput
    photos?: EvidencePhotoOrderByRelationAggregateInput
  }

  export type ExecutionRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId?: string
    idempotencyKey?: string
    AND?: ExecutionRecordWhereInput | ExecutionRecordWhereInput[]
    OR?: ExecutionRecordWhereInput[]
    NOT?: ExecutionRecordWhereInput | ExecutionRecordWhereInput[]
    technicianId?: StringFilter<"ExecutionRecord"> | string
    notes?: StringFilter<"ExecutionRecord"> | string
    payloadHash?: StringFilter<"ExecutionRecord"> | string
    submittedAt?: DateTimeFilter<"ExecutionRecord"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    technician?: XOR<UserRelationFilter, UserWhereInput>
    photos?: EvidencePhotoListRelationFilter
  }, "id" | "orderId" | "idempotencyKey">

  export type ExecutionRecordOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    technicianId?: SortOrder
    notes?: SortOrder
    idempotencyKey?: SortOrder
    payloadHash?: SortOrder
    submittedAt?: SortOrder
    _count?: ExecutionRecordCountOrderByAggregateInput
    _max?: ExecutionRecordMaxOrderByAggregateInput
    _min?: ExecutionRecordMinOrderByAggregateInput
  }

  export type ExecutionRecordScalarWhereWithAggregatesInput = {
    AND?: ExecutionRecordScalarWhereWithAggregatesInput | ExecutionRecordScalarWhereWithAggregatesInput[]
    OR?: ExecutionRecordScalarWhereWithAggregatesInput[]
    NOT?: ExecutionRecordScalarWhereWithAggregatesInput | ExecutionRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    orderId?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    technicianId?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    notes?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    idempotencyKey?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    payloadHash?: StringWithAggregatesFilter<"ExecutionRecord"> | string
    submittedAt?: DateTimeWithAggregatesFilter<"ExecutionRecord"> | Date | string
  }

  export type EvidencePhotoWhereInput = {
    AND?: EvidencePhotoWhereInput | EvidencePhotoWhereInput[]
    OR?: EvidencePhotoWhereInput[]
    NOT?: EvidencePhotoWhereInput | EvidencePhotoWhereInput[]
    id?: StringFilter<"EvidencePhoto"> | string
    executionRecordId?: StringFilter<"EvidencePhoto"> | string
    mimeType?: StringFilter<"EvidencePhoto"> | string
    storageKey?: StringNullableFilter<"EvidencePhoto"> | string | null
    sizeBytes?: IntFilter<"EvidencePhoto"> | number
    uploadedAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
    retentionExpiresAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
    executionRecord?: XOR<ExecutionRecordRelationFilter, ExecutionRecordWhereInput>
  }

  export type EvidencePhotoOrderByWithRelationInput = {
    id?: SortOrder
    executionRecordId?: SortOrder
    mimeType?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    retentionExpiresAt?: SortOrder
    executionRecord?: ExecutionRecordOrderByWithRelationInput
  }

  export type EvidencePhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvidencePhotoWhereInput | EvidencePhotoWhereInput[]
    OR?: EvidencePhotoWhereInput[]
    NOT?: EvidencePhotoWhereInput | EvidencePhotoWhereInput[]
    executionRecordId?: StringFilter<"EvidencePhoto"> | string
    mimeType?: StringFilter<"EvidencePhoto"> | string
    storageKey?: StringNullableFilter<"EvidencePhoto"> | string | null
    sizeBytes?: IntFilter<"EvidencePhoto"> | number
    uploadedAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
    retentionExpiresAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
    executionRecord?: XOR<ExecutionRecordRelationFilter, ExecutionRecordWhereInput>
  }, "id">

  export type EvidencePhotoOrderByWithAggregationInput = {
    id?: SortOrder
    executionRecordId?: SortOrder
    mimeType?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    retentionExpiresAt?: SortOrder
    _count?: EvidencePhotoCountOrderByAggregateInput
    _avg?: EvidencePhotoAvgOrderByAggregateInput
    _max?: EvidencePhotoMaxOrderByAggregateInput
    _min?: EvidencePhotoMinOrderByAggregateInput
    _sum?: EvidencePhotoSumOrderByAggregateInput
  }

  export type EvidencePhotoScalarWhereWithAggregatesInput = {
    AND?: EvidencePhotoScalarWhereWithAggregatesInput | EvidencePhotoScalarWhereWithAggregatesInput[]
    OR?: EvidencePhotoScalarWhereWithAggregatesInput[]
    NOT?: EvidencePhotoScalarWhereWithAggregatesInput | EvidencePhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EvidencePhoto"> | string
    executionRecordId?: StringWithAggregatesFilter<"EvidencePhoto"> | string
    mimeType?: StringWithAggregatesFilter<"EvidencePhoto"> | string
    storageKey?: StringNullableWithAggregatesFilter<"EvidencePhoto"> | string | null
    sizeBytes?: IntWithAggregatesFilter<"EvidencePhoto"> | number
    uploadedAt?: DateTimeWithAggregatesFilter<"EvidencePhoto"> | Date | string
    retentionExpiresAt?: DateTimeWithAggregatesFilter<"EvidencePhoto"> | Date | string
  }

  export type AuditLogEntryWhereInput = {
    AND?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    OR?: AuditLogEntryWhereInput[]
    NOT?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    id?: StringFilter<"AuditLogEntry"> | string
    orderId?: StringFilter<"AuditLogEntry"> | string
    actorUserId?: StringFilter<"AuditLogEntry"> | string
    action?: StringFilter<"AuditLogEntry"> | string
    timestamp?: DateTimeFilter<"AuditLogEntry"> | Date | string
    metadata?: StringNullableFilter<"AuditLogEntry"> | string | null
    retentionExpiresAt?: DateTimeFilter<"AuditLogEntry"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    actor?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AuditLogEntryOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    retentionExpiresAt?: SortOrder
    order?: OrderOrderByWithRelationInput
    actor?: UserOrderByWithRelationInput
  }

  export type AuditLogEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    OR?: AuditLogEntryWhereInput[]
    NOT?: AuditLogEntryWhereInput | AuditLogEntryWhereInput[]
    orderId?: StringFilter<"AuditLogEntry"> | string
    actorUserId?: StringFilter<"AuditLogEntry"> | string
    action?: StringFilter<"AuditLogEntry"> | string
    timestamp?: DateTimeFilter<"AuditLogEntry"> | Date | string
    metadata?: StringNullableFilter<"AuditLogEntry"> | string | null
    retentionExpiresAt?: DateTimeFilter<"AuditLogEntry"> | Date | string
    order?: XOR<OrderRelationFilter, OrderWhereInput>
    actor?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type AuditLogEntryOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    retentionExpiresAt?: SortOrder
    _count?: AuditLogEntryCountOrderByAggregateInput
    _max?: AuditLogEntryMaxOrderByAggregateInput
    _min?: AuditLogEntryMinOrderByAggregateInput
  }

  export type AuditLogEntryScalarWhereWithAggregatesInput = {
    AND?: AuditLogEntryScalarWhereWithAggregatesInput | AuditLogEntryScalarWhereWithAggregatesInput[]
    OR?: AuditLogEntryScalarWhereWithAggregatesInput[]
    NOT?: AuditLogEntryScalarWhereWithAggregatesInput | AuditLogEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLogEntry"> | string
    orderId?: StringWithAggregatesFilter<"AuditLogEntry"> | string
    actorUserId?: StringWithAggregatesFilter<"AuditLogEntry"> | string
    action?: StringWithAggregatesFilter<"AuditLogEntry"> | string
    timestamp?: DateTimeWithAggregatesFilter<"AuditLogEntry"> | Date | string
    metadata?: StringNullableWithAggregatesFilter<"AuditLogEntry"> | string | null
    retentionExpiresAt?: DateTimeWithAggregatesFilter<"AuditLogEntry"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevokedRefreshTokenCreateInput = {
    jti: string
    revokedAt?: Date | string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutRevokedRefreshTokensInput
  }

  export type RevokedRefreshTokenUncheckedCreateInput = {
    jti: string
    userId: string
    revokedAt?: Date | string
    expiresAt: Date | string
  }

  export type RevokedRefreshTokenUpdateInput = {
    jti?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRevokedRefreshTokensNestedInput
  }

  export type RevokedRefreshTokenUncheckedUpdateInput = {
    jti?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevokedRefreshTokenCreateManyInput = {
    jti: string
    userId: string
    revokedAt?: Date | string
    expiresAt: Date | string
  }

  export type RevokedRefreshTokenUpdateManyMutationInput = {
    jti?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevokedRefreshTokenUncheckedUpdateManyInput = {
    jti?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    client: UserCreateNestedOneWithoutOrdersAsClientInput
    technician?: UserCreateNestedOneWithoutOrdersAsTechnicianInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedOrdersInput
    executionRecord?: ExecutionRecordCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    executionRecord?: ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    client?: UserUpdateOneRequiredWithoutOrdersAsClientNestedInput
    technician?: UserUpdateOneWithoutOrdersAsTechnicianNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedOrdersNestedInput
    executionRecord?: ExecutionRecordUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionRecord?: ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExecutionRecordCreateInput = {
    id?: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    order: OrderCreateNestedOneWithoutExecutionRecordInput
    technician: UserCreateNestedOneWithoutExecutionRecordsInput
    photos?: EvidencePhotoCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordUncheckedCreateInput = {
    id?: string
    orderId: string
    technicianId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    photos?: EvidencePhotoUncheckedCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutExecutionRecordNestedInput
    technician?: UserUpdateOneRequiredWithoutExecutionRecordsNestedInput
    photos?: EvidencePhotoUpdateManyWithoutExecutionRecordNestedInput
  }

  export type ExecutionRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    technicianId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordNestedInput
  }

  export type ExecutionRecordCreateManyInput = {
    id?: string
    orderId: string
    technicianId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
  }

  export type ExecutionRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    technicianId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoCreateInput = {
    id?: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
    executionRecord: ExecutionRecordCreateNestedOneWithoutPhotosInput
  }

  export type EvidencePhotoUncheckedCreateInput = {
    id?: string
    executionRecordId: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
  }

  export type EvidencePhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executionRecord?: ExecutionRecordUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type EvidencePhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionRecordId?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoCreateManyInput = {
    id?: string
    executionRecordId: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
  }

  export type EvidencePhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    executionRecordId?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryCreateInput = {
    id?: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
    order: OrderCreateNestedOneWithoutAuditLogEntriesInput
    actor: UserCreateNestedOneWithoutAuditLogEntriesInput
  }

  export type AuditLogEntryUncheckedCreateInput = {
    id?: string
    orderId: string
    actorUserId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type AuditLogEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutAuditLogEntriesNestedInput
    actor?: UserUpdateOneRequiredWithoutAuditLogEntriesNestedInput
  }

  export type AuditLogEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryCreateManyInput = {
    id?: string
    orderId: string
    actorUserId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type AuditLogEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type ExecutionRecordListRelationFilter = {
    every?: ExecutionRecordWhereInput
    some?: ExecutionRecordWhereInput
    none?: ExecutionRecordWhereInput
  }

  export type AuditLogEntryListRelationFilter = {
    every?: AuditLogEntryWhereInput
    some?: AuditLogEntryWhereInput
    none?: AuditLogEntryWhereInput
  }

  export type RevokedRefreshTokenListRelationFilter = {
    every?: RevokedRefreshTokenWhereInput
    some?: RevokedRefreshTokenWhereInput
    none?: RevokedRefreshTokenWhereInput
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExecutionRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RevokedRefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    activo?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    activo?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    activo?: SortOrder
    nombre?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RevokedRefreshTokenCountOrderByAggregateInput = {
    jti?: SortOrder
    userId?: SortOrder
    revokedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type RevokedRefreshTokenMaxOrderByAggregateInput = {
    jti?: SortOrder
    userId?: SortOrder
    revokedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type RevokedRefreshTokenMinOrderByAggregateInput = {
    jti?: SortOrder
    userId?: SortOrder
    revokedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ExecutionRecordNullableRelationFilter = {
    is?: ExecutionRecordWhereInput | null
    isNot?: ExecutionRecordWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    clientId?: SortOrder
    technicianId?: SortOrder
    version?: SortOrder
    rejectionReason?: SortOrder
    resolvedByUserId?: SortOrder
    createdAt?: SortOrder
    assignedAt?: SortOrder
    submittedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    clientId?: SortOrder
    technicianId?: SortOrder
    version?: SortOrder
    rejectionReason?: SortOrder
    resolvedByUserId?: SortOrder
    createdAt?: SortOrder
    assignedAt?: SortOrder
    submittedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    clientId?: SortOrder
    technicianId?: SortOrder
    version?: SortOrder
    rejectionReason?: SortOrder
    resolvedByUserId?: SortOrder
    createdAt?: SortOrder
    assignedAt?: SortOrder
    submittedAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrderRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type EvidencePhotoListRelationFilter = {
    every?: EvidencePhotoWhereInput
    some?: EvidencePhotoWhereInput
    none?: EvidencePhotoWhereInput
  }

  export type EvidencePhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExecutionRecordCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    technicianId?: SortOrder
    notes?: SortOrder
    idempotencyKey?: SortOrder
    payloadHash?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExecutionRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    technicianId?: SortOrder
    notes?: SortOrder
    idempotencyKey?: SortOrder
    payloadHash?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExecutionRecordMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    technicianId?: SortOrder
    notes?: SortOrder
    idempotencyKey?: SortOrder
    payloadHash?: SortOrder
    submittedAt?: SortOrder
  }

  export type ExecutionRecordRelationFilter = {
    is?: ExecutionRecordWhereInput
    isNot?: ExecutionRecordWhereInput
  }

  export type EvidencePhotoCountOrderByAggregateInput = {
    id?: SortOrder
    executionRecordId?: SortOrder
    mimeType?: SortOrder
    storageKey?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type EvidencePhotoAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type EvidencePhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    executionRecordId?: SortOrder
    mimeType?: SortOrder
    storageKey?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type EvidencePhotoMinOrderByAggregateInput = {
    id?: SortOrder
    executionRecordId?: SortOrder
    mimeType?: SortOrder
    storageKey?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type EvidencePhotoSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type AuditLogEntryCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type AuditLogEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type AuditLogEntryMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    retentionExpiresAt?: SortOrder
  }

  export type OrderCreateNestedManyWithoutClientInput = {
    create?: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput> | OrderCreateWithoutClientInput[] | OrderUncheckedCreateWithoutClientInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutClientInput | OrderCreateOrConnectWithoutClientInput[]
    createMany?: OrderCreateManyClientInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type OrderCreateNestedManyWithoutTechnicianInput = {
    create?: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput> | OrderCreateWithoutTechnicianInput[] | OrderUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTechnicianInput | OrderCreateOrConnectWithoutTechnicianInput[]
    createMany?: OrderCreateManyTechnicianInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type ExecutionRecordCreateNestedManyWithoutTechnicianInput = {
    create?: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput> | ExecutionRecordCreateWithoutTechnicianInput[] | ExecutionRecordUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutTechnicianInput | ExecutionRecordCreateOrConnectWithoutTechnicianInput[]
    createMany?: ExecutionRecordCreateManyTechnicianInputEnvelope
    connect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
  }

  export type AuditLogEntryCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput> | AuditLogEntryCreateWithoutActorInput[] | AuditLogEntryUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutActorInput | AuditLogEntryCreateOrConnectWithoutActorInput[]
    createMany?: AuditLogEntryCreateManyActorInputEnvelope
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
  }

  export type OrderCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput> | OrderCreateWithoutResolvedByInput[] | OrderUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutResolvedByInput | OrderCreateOrConnectWithoutResolvedByInput[]
    createMany?: OrderCreateManyResolvedByInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type RevokedRefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput> | RevokedRefreshTokenCreateWithoutUserInput[] | RevokedRefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RevokedRefreshTokenCreateOrConnectWithoutUserInput | RevokedRefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RevokedRefreshTokenCreateManyUserInputEnvelope
    connect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput> | OrderCreateWithoutClientInput[] | OrderUncheckedCreateWithoutClientInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutClientInput | OrderCreateOrConnectWithoutClientInput[]
    createMany?: OrderCreateManyClientInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutTechnicianInput = {
    create?: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput> | OrderCreateWithoutTechnicianInput[] | OrderUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTechnicianInput | OrderCreateOrConnectWithoutTechnicianInput[]
    createMany?: OrderCreateManyTechnicianInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput = {
    create?: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput> | ExecutionRecordCreateWithoutTechnicianInput[] | ExecutionRecordUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutTechnicianInput | ExecutionRecordCreateOrConnectWithoutTechnicianInput[]
    createMany?: ExecutionRecordCreateManyTechnicianInputEnvelope
    connect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
  }

  export type AuditLogEntryUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput> | AuditLogEntryCreateWithoutActorInput[] | AuditLogEntryUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutActorInput | AuditLogEntryCreateOrConnectWithoutActorInput[]
    createMany?: AuditLogEntryCreateManyActorInputEnvelope
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput> | OrderCreateWithoutResolvedByInput[] | OrderUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutResolvedByInput | OrderCreateOrConnectWithoutResolvedByInput[]
    createMany?: OrderCreateManyResolvedByInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput> | RevokedRefreshTokenCreateWithoutUserInput[] | RevokedRefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RevokedRefreshTokenCreateOrConnectWithoutUserInput | RevokedRefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RevokedRefreshTokenCreateManyUserInputEnvelope
    connect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrderUpdateManyWithoutClientNestedInput = {
    create?: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput> | OrderCreateWithoutClientInput[] | OrderUncheckedCreateWithoutClientInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutClientInput | OrderCreateOrConnectWithoutClientInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutClientInput | OrderUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: OrderCreateManyClientInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutClientInput | OrderUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutClientInput | OrderUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type OrderUpdateManyWithoutTechnicianNestedInput = {
    create?: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput> | OrderCreateWithoutTechnicianInput[] | OrderUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTechnicianInput | OrderCreateOrConnectWithoutTechnicianInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutTechnicianInput | OrderUpsertWithWhereUniqueWithoutTechnicianInput[]
    createMany?: OrderCreateManyTechnicianInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutTechnicianInput | OrderUpdateWithWhereUniqueWithoutTechnicianInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutTechnicianInput | OrderUpdateManyWithWhereWithoutTechnicianInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type ExecutionRecordUpdateManyWithoutTechnicianNestedInput = {
    create?: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput> | ExecutionRecordCreateWithoutTechnicianInput[] | ExecutionRecordUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutTechnicianInput | ExecutionRecordCreateOrConnectWithoutTechnicianInput[]
    upsert?: ExecutionRecordUpsertWithWhereUniqueWithoutTechnicianInput | ExecutionRecordUpsertWithWhereUniqueWithoutTechnicianInput[]
    createMany?: ExecutionRecordCreateManyTechnicianInputEnvelope
    set?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    disconnect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    delete?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    connect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    update?: ExecutionRecordUpdateWithWhereUniqueWithoutTechnicianInput | ExecutionRecordUpdateWithWhereUniqueWithoutTechnicianInput[]
    updateMany?: ExecutionRecordUpdateManyWithWhereWithoutTechnicianInput | ExecutionRecordUpdateManyWithWhereWithoutTechnicianInput[]
    deleteMany?: ExecutionRecordScalarWhereInput | ExecutionRecordScalarWhereInput[]
  }

  export type AuditLogEntryUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput> | AuditLogEntryCreateWithoutActorInput[] | AuditLogEntryUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutActorInput | AuditLogEntryCreateOrConnectWithoutActorInput[]
    upsert?: AuditLogEntryUpsertWithWhereUniqueWithoutActorInput | AuditLogEntryUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditLogEntryCreateManyActorInputEnvelope
    set?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    disconnect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    delete?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    update?: AuditLogEntryUpdateWithWhereUniqueWithoutActorInput | AuditLogEntryUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditLogEntryUpdateManyWithWhereWithoutActorInput | AuditLogEntryUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
  }

  export type OrderUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput> | OrderCreateWithoutResolvedByInput[] | OrderUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutResolvedByInput | OrderCreateOrConnectWithoutResolvedByInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutResolvedByInput | OrderUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: OrderCreateManyResolvedByInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutResolvedByInput | OrderUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutResolvedByInput | OrderUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type RevokedRefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput> | RevokedRefreshTokenCreateWithoutUserInput[] | RevokedRefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RevokedRefreshTokenCreateOrConnectWithoutUserInput | RevokedRefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RevokedRefreshTokenUpsertWithWhereUniqueWithoutUserInput | RevokedRefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RevokedRefreshTokenCreateManyUserInputEnvelope
    set?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    disconnect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    delete?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    connect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    update?: RevokedRefreshTokenUpdateWithWhereUniqueWithoutUserInput | RevokedRefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RevokedRefreshTokenUpdateManyWithWhereWithoutUserInput | RevokedRefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RevokedRefreshTokenScalarWhereInput | RevokedRefreshTokenScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput> | OrderCreateWithoutClientInput[] | OrderUncheckedCreateWithoutClientInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutClientInput | OrderCreateOrConnectWithoutClientInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutClientInput | OrderUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: OrderCreateManyClientInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutClientInput | OrderUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutClientInput | OrderUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutTechnicianNestedInput = {
    create?: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput> | OrderCreateWithoutTechnicianInput[] | OrderUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutTechnicianInput | OrderCreateOrConnectWithoutTechnicianInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutTechnicianInput | OrderUpsertWithWhereUniqueWithoutTechnicianInput[]
    createMany?: OrderCreateManyTechnicianInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutTechnicianInput | OrderUpdateWithWhereUniqueWithoutTechnicianInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutTechnicianInput | OrderUpdateManyWithWhereWithoutTechnicianInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput = {
    create?: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput> | ExecutionRecordCreateWithoutTechnicianInput[] | ExecutionRecordUncheckedCreateWithoutTechnicianInput[]
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutTechnicianInput | ExecutionRecordCreateOrConnectWithoutTechnicianInput[]
    upsert?: ExecutionRecordUpsertWithWhereUniqueWithoutTechnicianInput | ExecutionRecordUpsertWithWhereUniqueWithoutTechnicianInput[]
    createMany?: ExecutionRecordCreateManyTechnicianInputEnvelope
    set?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    disconnect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    delete?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    connect?: ExecutionRecordWhereUniqueInput | ExecutionRecordWhereUniqueInput[]
    update?: ExecutionRecordUpdateWithWhereUniqueWithoutTechnicianInput | ExecutionRecordUpdateWithWhereUniqueWithoutTechnicianInput[]
    updateMany?: ExecutionRecordUpdateManyWithWhereWithoutTechnicianInput | ExecutionRecordUpdateManyWithWhereWithoutTechnicianInput[]
    deleteMany?: ExecutionRecordScalarWhereInput | ExecutionRecordScalarWhereInput[]
  }

  export type AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput> | AuditLogEntryCreateWithoutActorInput[] | AuditLogEntryUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutActorInput | AuditLogEntryCreateOrConnectWithoutActorInput[]
    upsert?: AuditLogEntryUpsertWithWhereUniqueWithoutActorInput | AuditLogEntryUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditLogEntryCreateManyActorInputEnvelope
    set?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    disconnect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    delete?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    update?: AuditLogEntryUpdateWithWhereUniqueWithoutActorInput | AuditLogEntryUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditLogEntryUpdateManyWithWhereWithoutActorInput | AuditLogEntryUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput> | OrderCreateWithoutResolvedByInput[] | OrderUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutResolvedByInput | OrderCreateOrConnectWithoutResolvedByInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutResolvedByInput | OrderUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: OrderCreateManyResolvedByInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutResolvedByInput | OrderUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutResolvedByInput | OrderUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput> | RevokedRefreshTokenCreateWithoutUserInput[] | RevokedRefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RevokedRefreshTokenCreateOrConnectWithoutUserInput | RevokedRefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RevokedRefreshTokenUpsertWithWhereUniqueWithoutUserInput | RevokedRefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RevokedRefreshTokenCreateManyUserInputEnvelope
    set?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    disconnect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    delete?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    connect?: RevokedRefreshTokenWhereUniqueInput | RevokedRefreshTokenWhereUniqueInput[]
    update?: RevokedRefreshTokenUpdateWithWhereUniqueWithoutUserInput | RevokedRefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RevokedRefreshTokenUpdateManyWithWhereWithoutUserInput | RevokedRefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RevokedRefreshTokenScalarWhereInput | RevokedRefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRevokedRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRevokedRefreshTokensInput, UserUncheckedCreateWithoutRevokedRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRevokedRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRevokedRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRevokedRefreshTokensInput, UserUncheckedCreateWithoutRevokedRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRevokedRefreshTokensInput
    upsert?: UserUpsertWithoutRevokedRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRevokedRefreshTokensInput, UserUpdateWithoutRevokedRefreshTokensInput>, UserUncheckedUpdateWithoutRevokedRefreshTokensInput>
  }

  export type UserCreateNestedOneWithoutOrdersAsClientInput = {
    create?: XOR<UserCreateWithoutOrdersAsClientInput, UserUncheckedCreateWithoutOrdersAsClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersAsClientInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrdersAsTechnicianInput = {
    create?: XOR<UserCreateWithoutOrdersAsTechnicianInput, UserUncheckedCreateWithoutOrdersAsTechnicianInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersAsTechnicianInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutResolvedOrdersInput = {
    create?: XOR<UserCreateWithoutResolvedOrdersInput, UserUncheckedCreateWithoutResolvedOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type ExecutionRecordCreateNestedOneWithoutOrderInput = {
    create?: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutOrderInput
    connect?: ExecutionRecordWhereUniqueInput
  }

  export type AuditLogEntryCreateNestedManyWithoutOrderInput = {
    create?: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput> | AuditLogEntryCreateWithoutOrderInput[] | AuditLogEntryUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutOrderInput | AuditLogEntryCreateOrConnectWithoutOrderInput[]
    createMany?: AuditLogEntryCreateManyOrderInputEnvelope
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
  }

  export type ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput = {
    create?: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutOrderInput
    connect?: ExecutionRecordWhereUniqueInput
  }

  export type AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput> | AuditLogEntryCreateWithoutOrderInput[] | AuditLogEntryUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutOrderInput | AuditLogEntryCreateOrConnectWithoutOrderInput[]
    createMany?: AuditLogEntryCreateManyOrderInputEnvelope
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutOrdersAsClientNestedInput = {
    create?: XOR<UserCreateWithoutOrdersAsClientInput, UserUncheckedCreateWithoutOrdersAsClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersAsClientInput
    upsert?: UserUpsertWithoutOrdersAsClientInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersAsClientInput, UserUpdateWithoutOrdersAsClientInput>, UserUncheckedUpdateWithoutOrdersAsClientInput>
  }

  export type UserUpdateOneWithoutOrdersAsTechnicianNestedInput = {
    create?: XOR<UserCreateWithoutOrdersAsTechnicianInput, UserUncheckedCreateWithoutOrdersAsTechnicianInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersAsTechnicianInput
    upsert?: UserUpsertWithoutOrdersAsTechnicianInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersAsTechnicianInput, UserUpdateWithoutOrdersAsTechnicianInput>, UserUncheckedUpdateWithoutOrdersAsTechnicianInput>
  }

  export type UserUpdateOneWithoutResolvedOrdersNestedInput = {
    create?: XOR<UserCreateWithoutResolvedOrdersInput, UserUncheckedCreateWithoutResolvedOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedOrdersInput
    upsert?: UserUpsertWithoutResolvedOrdersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResolvedOrdersInput, UserUpdateWithoutResolvedOrdersInput>, UserUncheckedUpdateWithoutResolvedOrdersInput>
  }

  export type ExecutionRecordUpdateOneWithoutOrderNestedInput = {
    create?: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutOrderInput
    upsert?: ExecutionRecordUpsertWithoutOrderInput
    disconnect?: ExecutionRecordWhereInput | boolean
    delete?: ExecutionRecordWhereInput | boolean
    connect?: ExecutionRecordWhereUniqueInput
    update?: XOR<XOR<ExecutionRecordUpdateToOneWithWhereWithoutOrderInput, ExecutionRecordUpdateWithoutOrderInput>, ExecutionRecordUncheckedUpdateWithoutOrderInput>
  }

  export type AuditLogEntryUpdateManyWithoutOrderNestedInput = {
    create?: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput> | AuditLogEntryCreateWithoutOrderInput[] | AuditLogEntryUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutOrderInput | AuditLogEntryCreateOrConnectWithoutOrderInput[]
    upsert?: AuditLogEntryUpsertWithWhereUniqueWithoutOrderInput | AuditLogEntryUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: AuditLogEntryCreateManyOrderInputEnvelope
    set?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    disconnect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    delete?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    update?: AuditLogEntryUpdateWithWhereUniqueWithoutOrderInput | AuditLogEntryUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: AuditLogEntryUpdateManyWithWhereWithoutOrderInput | AuditLogEntryUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
  }

  export type ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutOrderInput
    upsert?: ExecutionRecordUpsertWithoutOrderInput
    disconnect?: ExecutionRecordWhereInput | boolean
    delete?: ExecutionRecordWhereInput | boolean
    connect?: ExecutionRecordWhereUniqueInput
    update?: XOR<XOR<ExecutionRecordUpdateToOneWithWhereWithoutOrderInput, ExecutionRecordUpdateWithoutOrderInput>, ExecutionRecordUncheckedUpdateWithoutOrderInput>
  }

  export type AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput> | AuditLogEntryCreateWithoutOrderInput[] | AuditLogEntryUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: AuditLogEntryCreateOrConnectWithoutOrderInput | AuditLogEntryCreateOrConnectWithoutOrderInput[]
    upsert?: AuditLogEntryUpsertWithWhereUniqueWithoutOrderInput | AuditLogEntryUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: AuditLogEntryCreateManyOrderInputEnvelope
    set?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    disconnect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    delete?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    connect?: AuditLogEntryWhereUniqueInput | AuditLogEntryWhereUniqueInput[]
    update?: AuditLogEntryUpdateWithWhereUniqueWithoutOrderInput | AuditLogEntryUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: AuditLogEntryUpdateManyWithWhereWithoutOrderInput | AuditLogEntryUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
  }

  export type OrderCreateNestedOneWithoutExecutionRecordInput = {
    create?: XOR<OrderCreateWithoutExecutionRecordInput, OrderUncheckedCreateWithoutExecutionRecordInput>
    connectOrCreate?: OrderCreateOrConnectWithoutExecutionRecordInput
    connect?: OrderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutExecutionRecordsInput = {
    create?: XOR<UserCreateWithoutExecutionRecordsInput, UserUncheckedCreateWithoutExecutionRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExecutionRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type EvidencePhotoCreateNestedManyWithoutExecutionRecordInput = {
    create?: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput> | EvidencePhotoCreateWithoutExecutionRecordInput[] | EvidencePhotoUncheckedCreateWithoutExecutionRecordInput[]
    connectOrCreate?: EvidencePhotoCreateOrConnectWithoutExecutionRecordInput | EvidencePhotoCreateOrConnectWithoutExecutionRecordInput[]
    createMany?: EvidencePhotoCreateManyExecutionRecordInputEnvelope
    connect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
  }

  export type EvidencePhotoUncheckedCreateNestedManyWithoutExecutionRecordInput = {
    create?: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput> | EvidencePhotoCreateWithoutExecutionRecordInput[] | EvidencePhotoUncheckedCreateWithoutExecutionRecordInput[]
    connectOrCreate?: EvidencePhotoCreateOrConnectWithoutExecutionRecordInput | EvidencePhotoCreateOrConnectWithoutExecutionRecordInput[]
    createMany?: EvidencePhotoCreateManyExecutionRecordInputEnvelope
    connect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
  }

  export type OrderUpdateOneRequiredWithoutExecutionRecordNestedInput = {
    create?: XOR<OrderCreateWithoutExecutionRecordInput, OrderUncheckedCreateWithoutExecutionRecordInput>
    connectOrCreate?: OrderCreateOrConnectWithoutExecutionRecordInput
    upsert?: OrderUpsertWithoutExecutionRecordInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutExecutionRecordInput, OrderUpdateWithoutExecutionRecordInput>, OrderUncheckedUpdateWithoutExecutionRecordInput>
  }

  export type UserUpdateOneRequiredWithoutExecutionRecordsNestedInput = {
    create?: XOR<UserCreateWithoutExecutionRecordsInput, UserUncheckedCreateWithoutExecutionRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExecutionRecordsInput
    upsert?: UserUpsertWithoutExecutionRecordsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExecutionRecordsInput, UserUpdateWithoutExecutionRecordsInput>, UserUncheckedUpdateWithoutExecutionRecordsInput>
  }

  export type EvidencePhotoUpdateManyWithoutExecutionRecordNestedInput = {
    create?: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput> | EvidencePhotoCreateWithoutExecutionRecordInput[] | EvidencePhotoUncheckedCreateWithoutExecutionRecordInput[]
    connectOrCreate?: EvidencePhotoCreateOrConnectWithoutExecutionRecordInput | EvidencePhotoCreateOrConnectWithoutExecutionRecordInput[]
    upsert?: EvidencePhotoUpsertWithWhereUniqueWithoutExecutionRecordInput | EvidencePhotoUpsertWithWhereUniqueWithoutExecutionRecordInput[]
    createMany?: EvidencePhotoCreateManyExecutionRecordInputEnvelope
    set?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    disconnect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    delete?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    connect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    update?: EvidencePhotoUpdateWithWhereUniqueWithoutExecutionRecordInput | EvidencePhotoUpdateWithWhereUniqueWithoutExecutionRecordInput[]
    updateMany?: EvidencePhotoUpdateManyWithWhereWithoutExecutionRecordInput | EvidencePhotoUpdateManyWithWhereWithoutExecutionRecordInput[]
    deleteMany?: EvidencePhotoScalarWhereInput | EvidencePhotoScalarWhereInput[]
  }

  export type EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordNestedInput = {
    create?: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput> | EvidencePhotoCreateWithoutExecutionRecordInput[] | EvidencePhotoUncheckedCreateWithoutExecutionRecordInput[]
    connectOrCreate?: EvidencePhotoCreateOrConnectWithoutExecutionRecordInput | EvidencePhotoCreateOrConnectWithoutExecutionRecordInput[]
    upsert?: EvidencePhotoUpsertWithWhereUniqueWithoutExecutionRecordInput | EvidencePhotoUpsertWithWhereUniqueWithoutExecutionRecordInput[]
    createMany?: EvidencePhotoCreateManyExecutionRecordInputEnvelope
    set?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    disconnect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    delete?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    connect?: EvidencePhotoWhereUniqueInput | EvidencePhotoWhereUniqueInput[]
    update?: EvidencePhotoUpdateWithWhereUniqueWithoutExecutionRecordInput | EvidencePhotoUpdateWithWhereUniqueWithoutExecutionRecordInput[]
    updateMany?: EvidencePhotoUpdateManyWithWhereWithoutExecutionRecordInput | EvidencePhotoUpdateManyWithWhereWithoutExecutionRecordInput[]
    deleteMany?: EvidencePhotoScalarWhereInput | EvidencePhotoScalarWhereInput[]
  }

  export type ExecutionRecordCreateNestedOneWithoutPhotosInput = {
    create?: XOR<ExecutionRecordCreateWithoutPhotosInput, ExecutionRecordUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutPhotosInput
    connect?: ExecutionRecordWhereUniqueInput
  }

  export type ExecutionRecordUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<ExecutionRecordCreateWithoutPhotosInput, ExecutionRecordUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: ExecutionRecordCreateOrConnectWithoutPhotosInput
    upsert?: ExecutionRecordUpsertWithoutPhotosInput
    connect?: ExecutionRecordWhereUniqueInput
    update?: XOR<XOR<ExecutionRecordUpdateToOneWithWhereWithoutPhotosInput, ExecutionRecordUpdateWithoutPhotosInput>, ExecutionRecordUncheckedUpdateWithoutPhotosInput>
  }

  export type OrderCreateNestedOneWithoutAuditLogEntriesInput = {
    create?: XOR<OrderCreateWithoutAuditLogEntriesInput, OrderUncheckedCreateWithoutAuditLogEntriesInput>
    connectOrCreate?: OrderCreateOrConnectWithoutAuditLogEntriesInput
    connect?: OrderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditLogEntriesInput = {
    create?: XOR<UserCreateWithoutAuditLogEntriesInput, UserUncheckedCreateWithoutAuditLogEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogEntriesInput
    connect?: UserWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutAuditLogEntriesNestedInput = {
    create?: XOR<OrderCreateWithoutAuditLogEntriesInput, OrderUncheckedCreateWithoutAuditLogEntriesInput>
    connectOrCreate?: OrderCreateOrConnectWithoutAuditLogEntriesInput
    upsert?: OrderUpsertWithoutAuditLogEntriesInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutAuditLogEntriesInput, OrderUpdateWithoutAuditLogEntriesInput>, OrderUncheckedUpdateWithoutAuditLogEntriesInput>
  }

  export type UserUpdateOneRequiredWithoutAuditLogEntriesNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogEntriesInput, UserUncheckedCreateWithoutAuditLogEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogEntriesInput
    upsert?: UserUpsertWithoutAuditLogEntriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogEntriesInput, UserUpdateWithoutAuditLogEntriesInput>, UserUncheckedUpdateWithoutAuditLogEntriesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrderCreateWithoutClientInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    technician?: UserCreateNestedOneWithoutOrdersAsTechnicianInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedOrdersInput
    executionRecord?: ExecutionRecordCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutClientInput = {
    id?: string
    status?: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    executionRecord?: ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutClientInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput>
  }

  export type OrderCreateManyClientInputEnvelope = {
    data: OrderCreateManyClientInput | OrderCreateManyClientInput[]
  }

  export type OrderCreateWithoutTechnicianInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    client: UserCreateNestedOneWithoutOrdersAsClientInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedOrdersInput
    executionRecord?: ExecutionRecordCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutTechnicianInput = {
    id?: string
    status?: string
    clientId: string
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    executionRecord?: ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutTechnicianInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput>
  }

  export type OrderCreateManyTechnicianInputEnvelope = {
    data: OrderCreateManyTechnicianInput | OrderCreateManyTechnicianInput[]
  }

  export type ExecutionRecordCreateWithoutTechnicianInput = {
    id?: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    order: OrderCreateNestedOneWithoutExecutionRecordInput
    photos?: EvidencePhotoCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordUncheckedCreateWithoutTechnicianInput = {
    id?: string
    orderId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    photos?: EvidencePhotoUncheckedCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordCreateOrConnectWithoutTechnicianInput = {
    where: ExecutionRecordWhereUniqueInput
    create: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput>
  }

  export type ExecutionRecordCreateManyTechnicianInputEnvelope = {
    data: ExecutionRecordCreateManyTechnicianInput | ExecutionRecordCreateManyTechnicianInput[]
  }

  export type AuditLogEntryCreateWithoutActorInput = {
    id?: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
    order: OrderCreateNestedOneWithoutAuditLogEntriesInput
  }

  export type AuditLogEntryUncheckedCreateWithoutActorInput = {
    id?: string
    orderId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type AuditLogEntryCreateOrConnectWithoutActorInput = {
    where: AuditLogEntryWhereUniqueInput
    create: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput>
  }

  export type AuditLogEntryCreateManyActorInputEnvelope = {
    data: AuditLogEntryCreateManyActorInput | AuditLogEntryCreateManyActorInput[]
  }

  export type OrderCreateWithoutResolvedByInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    client: UserCreateNestedOneWithoutOrdersAsClientInput
    technician?: UserCreateNestedOneWithoutOrdersAsTechnicianInput
    executionRecord?: ExecutionRecordCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutResolvedByInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    executionRecord?: ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutResolvedByInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput>
  }

  export type OrderCreateManyResolvedByInputEnvelope = {
    data: OrderCreateManyResolvedByInput | OrderCreateManyResolvedByInput[]
  }

  export type RevokedRefreshTokenCreateWithoutUserInput = {
    jti: string
    revokedAt?: Date | string
    expiresAt: Date | string
  }

  export type RevokedRefreshTokenUncheckedCreateWithoutUserInput = {
    jti: string
    revokedAt?: Date | string
    expiresAt: Date | string
  }

  export type RevokedRefreshTokenCreateOrConnectWithoutUserInput = {
    where: RevokedRefreshTokenWhereUniqueInput
    create: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RevokedRefreshTokenCreateManyUserInputEnvelope = {
    data: RevokedRefreshTokenCreateManyUserInput | RevokedRefreshTokenCreateManyUserInput[]
  }

  export type OrderUpsertWithWhereUniqueWithoutClientInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutClientInput, OrderUncheckedUpdateWithoutClientInput>
    create: XOR<OrderCreateWithoutClientInput, OrderUncheckedCreateWithoutClientInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutClientInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutClientInput, OrderUncheckedUpdateWithoutClientInput>
  }

  export type OrderUpdateManyWithWhereWithoutClientInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutClientInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    status?: StringFilter<"Order"> | string
    clientId?: StringFilter<"Order"> | string
    technicianId?: StringNullableFilter<"Order"> | string | null
    version?: IntFilter<"Order"> | number
    rejectionReason?: StringNullableFilter<"Order"> | string | null
    resolvedByUserId?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    assignedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    submittedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
  }

  export type OrderUpsertWithWhereUniqueWithoutTechnicianInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutTechnicianInput, OrderUncheckedUpdateWithoutTechnicianInput>
    create: XOR<OrderCreateWithoutTechnicianInput, OrderUncheckedCreateWithoutTechnicianInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutTechnicianInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutTechnicianInput, OrderUncheckedUpdateWithoutTechnicianInput>
  }

  export type OrderUpdateManyWithWhereWithoutTechnicianInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutTechnicianInput>
  }

  export type ExecutionRecordUpsertWithWhereUniqueWithoutTechnicianInput = {
    where: ExecutionRecordWhereUniqueInput
    update: XOR<ExecutionRecordUpdateWithoutTechnicianInput, ExecutionRecordUncheckedUpdateWithoutTechnicianInput>
    create: XOR<ExecutionRecordCreateWithoutTechnicianInput, ExecutionRecordUncheckedCreateWithoutTechnicianInput>
  }

  export type ExecutionRecordUpdateWithWhereUniqueWithoutTechnicianInput = {
    where: ExecutionRecordWhereUniqueInput
    data: XOR<ExecutionRecordUpdateWithoutTechnicianInput, ExecutionRecordUncheckedUpdateWithoutTechnicianInput>
  }

  export type ExecutionRecordUpdateManyWithWhereWithoutTechnicianInput = {
    where: ExecutionRecordScalarWhereInput
    data: XOR<ExecutionRecordUpdateManyMutationInput, ExecutionRecordUncheckedUpdateManyWithoutTechnicianInput>
  }

  export type ExecutionRecordScalarWhereInput = {
    AND?: ExecutionRecordScalarWhereInput | ExecutionRecordScalarWhereInput[]
    OR?: ExecutionRecordScalarWhereInput[]
    NOT?: ExecutionRecordScalarWhereInput | ExecutionRecordScalarWhereInput[]
    id?: StringFilter<"ExecutionRecord"> | string
    orderId?: StringFilter<"ExecutionRecord"> | string
    technicianId?: StringFilter<"ExecutionRecord"> | string
    notes?: StringFilter<"ExecutionRecord"> | string
    idempotencyKey?: StringFilter<"ExecutionRecord"> | string
    payloadHash?: StringFilter<"ExecutionRecord"> | string
    submittedAt?: DateTimeFilter<"ExecutionRecord"> | Date | string
  }

  export type AuditLogEntryUpsertWithWhereUniqueWithoutActorInput = {
    where: AuditLogEntryWhereUniqueInput
    update: XOR<AuditLogEntryUpdateWithoutActorInput, AuditLogEntryUncheckedUpdateWithoutActorInput>
    create: XOR<AuditLogEntryCreateWithoutActorInput, AuditLogEntryUncheckedCreateWithoutActorInput>
  }

  export type AuditLogEntryUpdateWithWhereUniqueWithoutActorInput = {
    where: AuditLogEntryWhereUniqueInput
    data: XOR<AuditLogEntryUpdateWithoutActorInput, AuditLogEntryUncheckedUpdateWithoutActorInput>
  }

  export type AuditLogEntryUpdateManyWithWhereWithoutActorInput = {
    where: AuditLogEntryScalarWhereInput
    data: XOR<AuditLogEntryUpdateManyMutationInput, AuditLogEntryUncheckedUpdateManyWithoutActorInput>
  }

  export type AuditLogEntryScalarWhereInput = {
    AND?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
    OR?: AuditLogEntryScalarWhereInput[]
    NOT?: AuditLogEntryScalarWhereInput | AuditLogEntryScalarWhereInput[]
    id?: StringFilter<"AuditLogEntry"> | string
    orderId?: StringFilter<"AuditLogEntry"> | string
    actorUserId?: StringFilter<"AuditLogEntry"> | string
    action?: StringFilter<"AuditLogEntry"> | string
    timestamp?: DateTimeFilter<"AuditLogEntry"> | Date | string
    metadata?: StringNullableFilter<"AuditLogEntry"> | string | null
    retentionExpiresAt?: DateTimeFilter<"AuditLogEntry"> | Date | string
  }

  export type OrderUpsertWithWhereUniqueWithoutResolvedByInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutResolvedByInput, OrderUncheckedUpdateWithoutResolvedByInput>
    create: XOR<OrderCreateWithoutResolvedByInput, OrderUncheckedCreateWithoutResolvedByInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutResolvedByInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutResolvedByInput, OrderUncheckedUpdateWithoutResolvedByInput>
  }

  export type OrderUpdateManyWithWhereWithoutResolvedByInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutResolvedByInput>
  }

  export type RevokedRefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RevokedRefreshTokenWhereUniqueInput
    update: XOR<RevokedRefreshTokenUpdateWithoutUserInput, RevokedRefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RevokedRefreshTokenCreateWithoutUserInput, RevokedRefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RevokedRefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RevokedRefreshTokenWhereUniqueInput
    data: XOR<RevokedRefreshTokenUpdateWithoutUserInput, RevokedRefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RevokedRefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RevokedRefreshTokenScalarWhereInput
    data: XOR<RevokedRefreshTokenUpdateManyMutationInput, RevokedRefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RevokedRefreshTokenScalarWhereInput = {
    AND?: RevokedRefreshTokenScalarWhereInput | RevokedRefreshTokenScalarWhereInput[]
    OR?: RevokedRefreshTokenScalarWhereInput[]
    NOT?: RevokedRefreshTokenScalarWhereInput | RevokedRefreshTokenScalarWhereInput[]
    jti?: StringFilter<"RevokedRefreshToken"> | string
    userId?: StringFilter<"RevokedRefreshToken"> | string
    revokedAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
    expiresAt?: DateTimeFilter<"RevokedRefreshToken"> | Date | string
  }

  export type UserCreateWithoutRevokedRefreshTokensInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
  }

  export type UserUncheckedCreateWithoutRevokedRefreshTokensInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
  }

  export type UserCreateOrConnectWithoutRevokedRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRevokedRefreshTokensInput, UserUncheckedCreateWithoutRevokedRefreshTokensInput>
  }

  export type UserUpsertWithoutRevokedRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRevokedRefreshTokensInput, UserUncheckedUpdateWithoutRevokedRefreshTokensInput>
    create: XOR<UserCreateWithoutRevokedRefreshTokensInput, UserUncheckedCreateWithoutRevokedRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRevokedRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRevokedRefreshTokensInput, UserUncheckedUpdateWithoutRevokedRefreshTokensInput>
  }

  export type UserUpdateWithoutRevokedRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
  }

  export type UserUncheckedUpdateWithoutRevokedRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
  }

  export type UserCreateWithoutOrdersAsClientInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersAsClientInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersAsClientInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersAsClientInput, UserUncheckedCreateWithoutOrdersAsClientInput>
  }

  export type UserCreateWithoutOrdersAsTechnicianInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersAsTechnicianInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersAsTechnicianInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersAsTechnicianInput, UserUncheckedCreateWithoutOrdersAsTechnicianInput>
  }

  export type UserCreateWithoutResolvedOrdersInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResolvedOrdersInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResolvedOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResolvedOrdersInput, UserUncheckedCreateWithoutResolvedOrdersInput>
  }

  export type ExecutionRecordCreateWithoutOrderInput = {
    id?: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    technician: UserCreateNestedOneWithoutExecutionRecordsInput
    photos?: EvidencePhotoCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordUncheckedCreateWithoutOrderInput = {
    id?: string
    technicianId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    photos?: EvidencePhotoUncheckedCreateNestedManyWithoutExecutionRecordInput
  }

  export type ExecutionRecordCreateOrConnectWithoutOrderInput = {
    where: ExecutionRecordWhereUniqueInput
    create: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
  }

  export type AuditLogEntryCreateWithoutOrderInput = {
    id?: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
    actor: UserCreateNestedOneWithoutAuditLogEntriesInput
  }

  export type AuditLogEntryUncheckedCreateWithoutOrderInput = {
    id?: string
    actorUserId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type AuditLogEntryCreateOrConnectWithoutOrderInput = {
    where: AuditLogEntryWhereUniqueInput
    create: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput>
  }

  export type AuditLogEntryCreateManyOrderInputEnvelope = {
    data: AuditLogEntryCreateManyOrderInput | AuditLogEntryCreateManyOrderInput[]
  }

  export type UserUpsertWithoutOrdersAsClientInput = {
    update: XOR<UserUpdateWithoutOrdersAsClientInput, UserUncheckedUpdateWithoutOrdersAsClientInput>
    create: XOR<UserCreateWithoutOrdersAsClientInput, UserUncheckedCreateWithoutOrdersAsClientInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersAsClientInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersAsClientInput, UserUncheckedUpdateWithoutOrdersAsClientInput>
  }

  export type UserUpdateWithoutOrdersAsClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersAsClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutOrdersAsTechnicianInput = {
    update: XOR<UserUpdateWithoutOrdersAsTechnicianInput, UserUncheckedUpdateWithoutOrdersAsTechnicianInput>
    create: XOR<UserCreateWithoutOrdersAsTechnicianInput, UserUncheckedCreateWithoutOrdersAsTechnicianInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersAsTechnicianInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersAsTechnicianInput, UserUncheckedUpdateWithoutOrdersAsTechnicianInput>
  }

  export type UserUpdateWithoutOrdersAsTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersAsTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutResolvedOrdersInput = {
    update: XOR<UserUpdateWithoutResolvedOrdersInput, UserUncheckedUpdateWithoutResolvedOrdersInput>
    create: XOR<UserCreateWithoutResolvedOrdersInput, UserUncheckedCreateWithoutResolvedOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResolvedOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResolvedOrdersInput, UserUncheckedUpdateWithoutResolvedOrdersInput>
  }

  export type UserUpdateWithoutResolvedOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResolvedOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExecutionRecordUpsertWithoutOrderInput = {
    update: XOR<ExecutionRecordUpdateWithoutOrderInput, ExecutionRecordUncheckedUpdateWithoutOrderInput>
    create: XOR<ExecutionRecordCreateWithoutOrderInput, ExecutionRecordUncheckedCreateWithoutOrderInput>
    where?: ExecutionRecordWhereInput
  }

  export type ExecutionRecordUpdateToOneWithWhereWithoutOrderInput = {
    where?: ExecutionRecordWhereInput
    data: XOR<ExecutionRecordUpdateWithoutOrderInput, ExecutionRecordUncheckedUpdateWithoutOrderInput>
  }

  export type ExecutionRecordUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: UserUpdateOneRequiredWithoutExecutionRecordsNestedInput
    photos?: EvidencePhotoUpdateManyWithoutExecutionRecordNestedInput
  }

  export type ExecutionRecordUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    technicianId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordNestedInput
  }

  export type AuditLogEntryUpsertWithWhereUniqueWithoutOrderInput = {
    where: AuditLogEntryWhereUniqueInput
    update: XOR<AuditLogEntryUpdateWithoutOrderInput, AuditLogEntryUncheckedUpdateWithoutOrderInput>
    create: XOR<AuditLogEntryCreateWithoutOrderInput, AuditLogEntryUncheckedCreateWithoutOrderInput>
  }

  export type AuditLogEntryUpdateWithWhereUniqueWithoutOrderInput = {
    where: AuditLogEntryWhereUniqueInput
    data: XOR<AuditLogEntryUpdateWithoutOrderInput, AuditLogEntryUncheckedUpdateWithoutOrderInput>
  }

  export type AuditLogEntryUpdateManyWithWhereWithoutOrderInput = {
    where: AuditLogEntryScalarWhereInput
    data: XOR<AuditLogEntryUpdateManyMutationInput, AuditLogEntryUncheckedUpdateManyWithoutOrderInput>
  }

  export type OrderCreateWithoutExecutionRecordInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    client: UserCreateNestedOneWithoutOrdersAsClientInput
    technician?: UserCreateNestedOneWithoutOrdersAsTechnicianInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedOrdersInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutExecutionRecordInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutExecutionRecordInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutExecutionRecordInput, OrderUncheckedCreateWithoutExecutionRecordInput>
  }

  export type UserCreateWithoutExecutionRecordsInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExecutionRecordsInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    auditLogEntries?: AuditLogEntryUncheckedCreateNestedManyWithoutActorInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExecutionRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExecutionRecordsInput, UserUncheckedCreateWithoutExecutionRecordsInput>
  }

  export type EvidencePhotoCreateWithoutExecutionRecordInput = {
    id?: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
  }

  export type EvidencePhotoUncheckedCreateWithoutExecutionRecordInput = {
    id?: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
  }

  export type EvidencePhotoCreateOrConnectWithoutExecutionRecordInput = {
    where: EvidencePhotoWhereUniqueInput
    create: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput>
  }

  export type EvidencePhotoCreateManyExecutionRecordInputEnvelope = {
    data: EvidencePhotoCreateManyExecutionRecordInput | EvidencePhotoCreateManyExecutionRecordInput[]
  }

  export type OrderUpsertWithoutExecutionRecordInput = {
    update: XOR<OrderUpdateWithoutExecutionRecordInput, OrderUncheckedUpdateWithoutExecutionRecordInput>
    create: XOR<OrderCreateWithoutExecutionRecordInput, OrderUncheckedCreateWithoutExecutionRecordInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutExecutionRecordInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutExecutionRecordInput, OrderUncheckedUpdateWithoutExecutionRecordInput>
  }

  export type OrderUpdateWithoutExecutionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    client?: UserUpdateOneRequiredWithoutOrdersAsClientNestedInput
    technician?: UserUpdateOneWithoutOrdersAsTechnicianNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedOrdersNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutExecutionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type UserUpsertWithoutExecutionRecordsInput = {
    update: XOR<UserUpdateWithoutExecutionRecordsInput, UserUncheckedUpdateWithoutExecutionRecordsInput>
    create: XOR<UserCreateWithoutExecutionRecordsInput, UserUncheckedCreateWithoutExecutionRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExecutionRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExecutionRecordsInput, UserUncheckedUpdateWithoutExecutionRecordsInput>
  }

  export type UserUpdateWithoutExecutionRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExecutionRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutActorNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EvidencePhotoUpsertWithWhereUniqueWithoutExecutionRecordInput = {
    where: EvidencePhotoWhereUniqueInput
    update: XOR<EvidencePhotoUpdateWithoutExecutionRecordInput, EvidencePhotoUncheckedUpdateWithoutExecutionRecordInput>
    create: XOR<EvidencePhotoCreateWithoutExecutionRecordInput, EvidencePhotoUncheckedCreateWithoutExecutionRecordInput>
  }

  export type EvidencePhotoUpdateWithWhereUniqueWithoutExecutionRecordInput = {
    where: EvidencePhotoWhereUniqueInput
    data: XOR<EvidencePhotoUpdateWithoutExecutionRecordInput, EvidencePhotoUncheckedUpdateWithoutExecutionRecordInput>
  }

  export type EvidencePhotoUpdateManyWithWhereWithoutExecutionRecordInput = {
    where: EvidencePhotoScalarWhereInput
    data: XOR<EvidencePhotoUpdateManyMutationInput, EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordInput>
  }

  export type EvidencePhotoScalarWhereInput = {
    AND?: EvidencePhotoScalarWhereInput | EvidencePhotoScalarWhereInput[]
    OR?: EvidencePhotoScalarWhereInput[]
    NOT?: EvidencePhotoScalarWhereInput | EvidencePhotoScalarWhereInput[]
    id?: StringFilter<"EvidencePhoto"> | string
    executionRecordId?: StringFilter<"EvidencePhoto"> | string
    mimeType?: StringFilter<"EvidencePhoto"> | string
    storageKey?: StringNullableFilter<"EvidencePhoto"> | string | null
    sizeBytes?: IntFilter<"EvidencePhoto"> | number
    uploadedAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
    retentionExpiresAt?: DateTimeFilter<"EvidencePhoto"> | Date | string
  }

  export type ExecutionRecordCreateWithoutPhotosInput = {
    id?: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
    order: OrderCreateNestedOneWithoutExecutionRecordInput
    technician: UserCreateNestedOneWithoutExecutionRecordsInput
  }

  export type ExecutionRecordUncheckedCreateWithoutPhotosInput = {
    id?: string
    orderId: string
    technicianId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
  }

  export type ExecutionRecordCreateOrConnectWithoutPhotosInput = {
    where: ExecutionRecordWhereUniqueInput
    create: XOR<ExecutionRecordCreateWithoutPhotosInput, ExecutionRecordUncheckedCreateWithoutPhotosInput>
  }

  export type ExecutionRecordUpsertWithoutPhotosInput = {
    update: XOR<ExecutionRecordUpdateWithoutPhotosInput, ExecutionRecordUncheckedUpdateWithoutPhotosInput>
    create: XOR<ExecutionRecordCreateWithoutPhotosInput, ExecutionRecordUncheckedCreateWithoutPhotosInput>
    where?: ExecutionRecordWhereInput
  }

  export type ExecutionRecordUpdateToOneWithWhereWithoutPhotosInput = {
    where?: ExecutionRecordWhereInput
    data: XOR<ExecutionRecordUpdateWithoutPhotosInput, ExecutionRecordUncheckedUpdateWithoutPhotosInput>
  }

  export type ExecutionRecordUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutExecutionRecordNestedInput
    technician?: UserUpdateOneRequiredWithoutExecutionRecordsNestedInput
  }

  export type ExecutionRecordUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    technicianId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateWithoutAuditLogEntriesInput = {
    id?: string
    status?: string
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    client: UserCreateNestedOneWithoutOrdersAsClientInput
    technician?: UserCreateNestedOneWithoutOrdersAsTechnicianInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedOrdersInput
    executionRecord?: ExecutionRecordCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutAuditLogEntriesInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
    executionRecord?: ExecutionRecordUncheckedCreateNestedOneWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutAuditLogEntriesInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutAuditLogEntriesInput, OrderUncheckedCreateWithoutAuditLogEntriesInput>
  }

  export type UserCreateWithoutAuditLogEntriesInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordCreateNestedManyWithoutTechnicianInput
    resolvedOrders?: OrderCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogEntriesInput = {
    id?: string
    role: string
    activo?: boolean
    nombre: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    ordersAsClient?: OrderUncheckedCreateNestedManyWithoutClientInput
    ordersAsTechnician?: OrderUncheckedCreateNestedManyWithoutTechnicianInput
    executionRecords?: ExecutionRecordUncheckedCreateNestedManyWithoutTechnicianInput
    resolvedOrders?: OrderUncheckedCreateNestedManyWithoutResolvedByInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogEntriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogEntriesInput, UserUncheckedCreateWithoutAuditLogEntriesInput>
  }

  export type OrderUpsertWithoutAuditLogEntriesInput = {
    update: XOR<OrderUpdateWithoutAuditLogEntriesInput, OrderUncheckedUpdateWithoutAuditLogEntriesInput>
    create: XOR<OrderCreateWithoutAuditLogEntriesInput, OrderUncheckedCreateWithoutAuditLogEntriesInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutAuditLogEntriesInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutAuditLogEntriesInput, OrderUncheckedUpdateWithoutAuditLogEntriesInput>
  }

  export type OrderUpdateWithoutAuditLogEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    client?: UserUpdateOneRequiredWithoutOrdersAsClientNestedInput
    technician?: UserUpdateOneWithoutOrdersAsTechnicianNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedOrdersNestedInput
    executionRecord?: ExecutionRecordUpdateOneWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutAuditLogEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionRecord?: ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type UserUpsertWithoutAuditLogEntriesInput = {
    update: XOR<UserUpdateWithoutAuditLogEntriesInput, UserUncheckedUpdateWithoutAuditLogEntriesInput>
    create: XOR<UserCreateWithoutAuditLogEntriesInput, UserUncheckedCreateWithoutAuditLogEntriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogEntriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogEntriesInput, UserUncheckedUpdateWithoutAuditLogEntriesInput>
  }

  export type UserUpdateWithoutAuditLogEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUpdateManyWithoutTechnicianNestedInput
    resolvedOrders?: OrderUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    nombre?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordersAsClient?: OrderUncheckedUpdateManyWithoutClientNestedInput
    ordersAsTechnician?: OrderUncheckedUpdateManyWithoutTechnicianNestedInput
    executionRecords?: ExecutionRecordUncheckedUpdateManyWithoutTechnicianNestedInput
    resolvedOrders?: OrderUncheckedUpdateManyWithoutResolvedByNestedInput
    revokedRefreshTokens?: RevokedRefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrderCreateManyClientInput = {
    id?: string
    status?: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
  }

  export type OrderCreateManyTechnicianInput = {
    id?: string
    status?: string
    clientId: string
    version?: number
    rejectionReason?: string | null
    resolvedByUserId?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
  }

  export type ExecutionRecordCreateManyTechnicianInput = {
    id?: string
    orderId: string
    notes: string
    idempotencyKey: string
    payloadHash: string
    submittedAt?: Date | string
  }

  export type AuditLogEntryCreateManyActorInput = {
    id?: string
    orderId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type OrderCreateManyResolvedByInput = {
    id?: string
    status?: string
    clientId: string
    technicianId?: string | null
    version?: number
    rejectionReason?: string | null
    createdAt?: Date | string
    assignedAt?: Date | string | null
    submittedAt?: Date | string | null
    resolvedAt?: Date | string | null
  }

  export type RevokedRefreshTokenCreateManyUserInput = {
    jti: string
    revokedAt?: Date | string
    expiresAt: Date | string
  }

  export type OrderUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: UserUpdateOneWithoutOrdersAsTechnicianNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedOrdersNestedInput
    executionRecord?: ExecutionRecordUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionRecord?: ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrderUpdateWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    client?: UserUpdateOneRequiredWithoutOrdersAsClientNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedOrdersNestedInput
    executionRecord?: ExecutionRecordUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionRecord?: ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExecutionRecordUpdateWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutExecutionRecordNestedInput
    photos?: EvidencePhotoUpdateManyWithoutExecutionRecordNestedInput
  }

  export type ExecutionRecordUncheckedUpdateWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordNestedInput
  }

  export type ExecutionRecordUncheckedUpdateManyWithoutTechnicianInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    payloadHash?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutAuditLogEntriesNestedInput
  }

  export type AuditLogEntryUncheckedUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryUncheckedUpdateManyWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    client?: UserUpdateOneRequiredWithoutOrdersAsClientNestedInput
    technician?: UserUpdateOneWithoutOrdersAsTechnicianNestedInput
    executionRecord?: ExecutionRecordUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionRecord?: ExecutionRecordUncheckedUpdateOneWithoutOrderNestedInput
    auditLogEntries?: AuditLogEntryUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateManyWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    technicianId?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RevokedRefreshTokenUpdateWithoutUserInput = {
    jti?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevokedRefreshTokenUncheckedUpdateWithoutUserInput = {
    jti?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevokedRefreshTokenUncheckedUpdateManyWithoutUserInput = {
    jti?: StringFieldUpdateOperationsInput | string
    revokedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryCreateManyOrderInput = {
    id?: string
    actorUserId: string
    action: string
    timestamp?: Date | string
    metadata?: string | null
    retentionExpiresAt: Date | string
  }

  export type AuditLogEntryUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneRequiredWithoutAuditLogEntriesNestedInput
  }

  export type AuditLogEntryUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogEntryUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorUserId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoCreateManyExecutionRecordInput = {
    id?: string
    mimeType: string
    storageKey?: string | null
    sizeBytes: number
    uploadedAt?: Date | string
    retentionExpiresAt: Date | string
  }

  export type EvidencePhotoUpdateWithoutExecutionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoUncheckedUpdateWithoutExecutionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidencePhotoUncheckedUpdateManyWithoutExecutionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    retentionExpiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderCountOutputTypeDefaultArgs instead
     */
    export type OrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExecutionRecordCountOutputTypeDefaultArgs instead
     */
    export type ExecutionRecordCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExecutionRecordCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RevokedRefreshTokenDefaultArgs instead
     */
    export type RevokedRefreshTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RevokedRefreshTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderDefaultArgs instead
     */
    export type OrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExecutionRecordDefaultArgs instead
     */
    export type ExecutionRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExecutionRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EvidencePhotoDefaultArgs instead
     */
    export type EvidencePhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EvidencePhotoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogEntryDefaultArgs instead
     */
    export type AuditLogEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogEntryDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}