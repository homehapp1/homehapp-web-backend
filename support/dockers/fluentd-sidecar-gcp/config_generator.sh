#!/bin/bash

# Copyright 2015 The Kubernetes Authors All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

mkdir -p /etc/google-fluentd/files
if [ -z "$FILES_TO_COLLECT" ]; then
  exit 0
fi

if [ "$PROJECT_NAME" = "" ]; then
  PROJECT_NAME="default"
fi

for filepath in $FILES_TO_COLLECT
do
  filename=$(basename $filepath)
  cat > "/etc/google-fluentd/files/${filename}" << EndOfMessage
<source>
  type tail
  format none
  time_key time
  path ${filepath}
  pos_file /etc/google-fluentd/fluentd-gcp.log.pos
  time_format %Y-%m-%dT%H:%M:%S
  tag app.${PROJECT_NAME}.${filename}
  read_from_head true
</source>
EndOfMessage
done
