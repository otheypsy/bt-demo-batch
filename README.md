bt-demo-batch
===========

Batch scripts to generate payment activity on a Braintree sandbox gateway:

- Transactions
- Customers

## Deploy to Digital Ocean

- Initial version of deployment
- Leverage GitHub Actions to deploy to droplet

1. Droplet
2. Deploy User
3. Git
4. Node
5. Test 
6. Cron Job

### Droplet

- Follow steps [here](https://docs.digitalocean.com/products/droplets/how-to/create/) to create droplet
- Add SSH Key to access VM

### Deploy User

- Create new user to access VM
- Assign user to sudo group
- Log in as the user

```
adduser [username]
usermod -aG sudo [username]
sudo su - [username]
```

### Git

- Install git
- Follow steps [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) to configure SSH key

### Node

- Install node
- Install node dependencies
- Create `.env` file in the project root with the below contents
- Define BT credentials as environment variables

`
nano /path/to/project/.env
`
```
BT_MERCHANT_ID=
BT_PUBLIC_KEY=
BT_PRIVATE_KEY=
BT_TOKENIZATION_KEY=
BT_DEFAULT_MERCHANT_ACCOUNT_ID=
```

### Braintree MAIDs

- Configure Braintree MAIDs to be used for the batches
- `src/data/maid.data.js`

### Test

- Test script to ensure everything is working as expected

### Cron Job

- List current `crontab` entries using `crontab -l`
- Create an entry in `crontab` using `crontab -e`

`0 8 * * * /home/odesai/bt-demo-batch/cronjob-bt-demo-batch.sh >> /home/odesai/bt-demo-batch/cron.log 2>&1`

### References
- https://medium.com/@chathula/how-to-set-up-a-ci-cd-pipeline-for-a-node-js-app-with-github-actions-2073201b0df6
- https://gist.github.com/carlssonk/97d474045e69f8e394ed23f91695f56e
- https://github.com/tfarras/nodejs-deploy
- https://medium.com/swlh/how-to-deploy-your-application-to-digital-ocean-using-github-actions-and-save-up-on-ci-cd-costs-74b7315facc2
- https://crontab-generator.org/

### Future Potential Enhancements
- Move batching to container
- Use doctl action

