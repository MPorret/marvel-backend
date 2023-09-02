# MARVEL - BACKEND

My Marvel Backend use <a href="https://lereacteur-marvel-api.netlify.app/">the Reacteur's API</a>.

## Characters

### Route : /characters

Method : GET

Description : Get a list of character

| query  | info                       | required |
| ------ | -------------------------- | -------- |
| userId | mongodb id of user log     | no       |
| name   | search a character by name | no       |
| page   | page selected              | yes      |

### Route : /character/:characterId

Method : GET

Description : Get the infos of a specific character

| params      | info                 | required |
| ----------- | -------------------- | -------- |
| characterId | character mongodb id | yes      |

### Route : /togglecharacter

Method : POST

Description : Add or remove a favorite charater

| body        | info                   | required |
| ----------- | ---------------------- | -------- |
| userId      | mongodb id of user log | yes      |
| characterId | character mongodb id   | yes      |

## Comics

### Route : /comicss

Method : GET

Description : Get a list of comic

| query  | info                    | required |
| ------ | ----------------------- | -------- |
| userId | mongodb id of user log  | no       |
| title  | search a comic by title | no       |
| page   | page selected           | yes      |

### Route : /togglecomic

Method : POST

Description : Add or remove a favorite comic

| body    | info                   | required |
| ------- | ---------------------- | -------- |
| userId  | mongodb id of user log | yes      |
| comicId | comic mongodb id       | yes      |

## User

### Route : /signup

Method : POST

Description : add an user in database and log him

| body     | info                 | required |
| -------- | -------------------- | -------- |
| username | username of the user | yes      |
| email    | email of the user    | yes      |
| password | password of the user | yes      |

### Route : /login

Method : POST

Description : login an user

| body     | info                 | required |
| -------- | -------------------- | -------- |
| email    | email of the user    | yes      |
| password | password of the user | yes      |

### Route : /user

Method : GET

Description : show user page with favorites

| query | info                   | required |
| ----- | ---------------------- | -------- |
| id    | mongodb id of user log | yes      |
