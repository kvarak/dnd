(grep -h 'specific:' docs/_Classes/*.md | grep -oE '"[a-z-]+"' | tr -d '"'; \
 grep -E '^\s+[a-z-]+:' _data/question-bank.yml | \
   grep -v -E '^\s+(yes|no|maybe|dont-know|text|category|answers|id):' | \
   awk '{print $1}' | tr -d ':') | sort | uniq -c | sort -rn

