bt-demo-batch
===========

Batch scripts to generate payment activity on a Braintree sandbox gateway:

- Transactions
- Customers

## Deploy to Digital Ocean

- Initial version of deployment
- Leverage GitHub Actions to deploy to droplet

1. Create Droplet
2. Add User
3. Install Git
4. Generate SSH Key 
5. Copy Deploy Key into GitHub 
6. Install Node
7. Install Node Production Dependencies
8. Setup Cron Job

### References
- https://medium.com/@chathula/how-to-set-up-a-ci-cd-pipeline-for-a-node-js-app-with-github-actions-2073201b0df6
- https://gist.github.com/carlssonk/97d474045e69f8e394ed23f91695f56e
- https://github.com/tfarras/nodejs-deploy
- https://medium.com/swlh/how-to-deploy-your-application-to-digital-ocean-using-github-actions-and-save-up-on-ci-cd-costs-74b7315facc2
- https://crontab-generator.org/

### Future Potential Enhancements
- Move batching to container
- Use doctl action

