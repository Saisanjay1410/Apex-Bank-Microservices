# Banking Service - fixes applied

## Fixed
1. Public auth endpoints now match `/auth/**`.
2. Added BCrypt password hashing.
3. Added role-based endpoint authorization.
4. Added inactive-user check during login.
5. Moved JWT secret to `jwt.secret` configuration.
6. Added request validation for registration/login/transactions.
7. Transactions now require an `accountId`.
8. Deposits increase account balance.
9. Withdrawals decrease account balance and reject insufficient funds.
10. Transaction update/delete reverse the old balance effect.
11. Transaction/account not-found errors use `ResourceNotFoundException`.
12. Public registration always creates `ROLE_EMPLOYEE`; clients cannot self-register as ADMIN/HR.

## Before running
Set a JWT secret environment variable of at least 32 characters:

`JWT_SECRET=your-long-random-secret-here`

Also ensure MySQL, Eureka, and Kafka are running as configured in `application.properties`.

## Build note
A full Maven compile could not be run in this environment because Maven dependencies could not be downloaded from Maven Central. The project was therefore checked by source-level inspection after the changes.


## Second-pass integrity/security fixes

- Account updates no longer accept a client-supplied balance. Balance changes must use transactions.
- Account numbers and employee IDs are checked for uniqueness.
- Accounts can be linked to an employee through `employeeId`; an employee cannot be linked to two accounts.
- Accounts with transaction history cannot be deleted.
- Transaction account rows use a required foreign key and account lookups use a pessimistic write lock to reduce concurrent balance-update races.
- Employee endpoints now validate request bodies and use `ResourceNotFoundException`.
- JWT authentication rejects inactive users even when the token is otherwise valid.
- Database credentials and JWT secret are environment-driven.

### Required environment variables

```text
DB_PASSWORD=your_mysql_password
JWT_SECRET=a_random_secret_at_least_32_characters_long
```

Optional: `DB_URL` and `DB_USERNAME` can override the defaults.
