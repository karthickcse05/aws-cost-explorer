PROFILE = ensemble
ENVIRONMENT = sbx
PREFIX = tracerensemble
Sender =  svesadmin@tranetechnologies.com
Receiver =  karthick.s@tranetechnologies.com
BucketName = tracer-ensemble-artifact
REGION = us-east-1


.PHONY: build
build: ## Zips the code to the index.zip
	npm run build


.PHONY: package
package: ## packages the file in s3
	aws cloudformation package \
    --template-file "infrastructure\cost-explorer.yaml" \
    --s3-bucket  $(BucketName) \
    --output-template-file "cost-explorer-release.yaml" \
	--profile  $(PROFILE) \


.PHONY: create_stack
create_stack: ## Creates a  cloudformation stack in AWS
		make deploy ACTION=create

.PHONY: update_stack
update_stack: ## Updates an existing cloudformation stack in AWS
		make deploy ACTION=update


.PHONY: deploy
deploy:  ## deploy the  cloudformation stack in AWS
	aws cloudformation $(ACTION)-stack \
	--stack-name ${PREFIX}-$(ENVIRONMENT)-costexplorer \
	--template-body file://cost-explorer-release.yaml \
	--profile $(PROFILE) \
	--capabilities  CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
	--parameters \
		ParameterKey=sender,ParameterValue=$(Sender) \
		ParameterKey=receiver,ParameterValue=$(Receiver) \
		ParameterKey=env,ParameterValue=$(ENVIRONMENT) \
	--region ${REGION}

.PHONY: create_bucket
create_bucket: ## Creates a new bucket cloudformation stack in AWS
		make create_update_bucket ACTION=create

.PHONY: update_bucket
update_bucket: ## Updates an existing bucket cloudformation stack in AWS
		make create_update_bucket ACTION=update

.PHONY: create_update_bucket
create_update_bucket: ## Creates or updates the bucket cloudformation stack based on the action
	aws cloudformation $(ACTION)-stack \
	--stack-name ${PREFIX}-$(ENVIRONMENT)-buckets \
	--template-body file://infrastructure/pre-requistes/artifact-store-stack.yaml \
	--profile $(PROFILE) \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters \
		ParameterKey=StackPrefix,ParameterValue=$(PREFIX) \
		ParameterKey=Environment,ParameterValue=$(ENVIRONMENT) \