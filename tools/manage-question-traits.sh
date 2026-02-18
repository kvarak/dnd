#!/bin/bash
# Question Bank Trait Management Helper
# Uses yq to manipulate _data/question-bank.yml
#
# This script provides utilities to help add/modify traits in question answers.

set -e

QUESTION_BANK="_data/question-bank.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
  cat << EOF
Usage: $(basename "$0") <command> [options]

Commands:
  list-questions              List all question IDs and text
  list-traits                 List all unique traits in question bank
  show-question <id>          Show full question with all answers and traits
  find-trait <trait>          Find all questions that score a specific trait
  add-trait <q-id> <answer> <trait> <score>
                              Add a trait score to a question's answer
  suggest-questions <trait>   Show questions where a trait might fit (by keyword)
  trait-coverage <trait>      Show how many questions cover a trait
  backup                      Create backup of question-bank.yml

Examples:
  # List all questions
  $(basename "$0") list-questions

  # See what's in the "healing-magic" question
  $(basename "$0") show-question healing-magic

  # Find all questions scoring "protective-value"
  $(basename "$0") find-trait protective-value

  # Add protective-value +2 to "defensive-protection" question's "yes" answer
  $(basename "$0") add-trait defensive-protection yes protective-value +2

  # Find questions that might be good for adding "charismatic" trait
  $(basename "$0") suggest-questions charismatic

  # Check coverage for a trait
  $(basename "$0") trait-coverage inspirational-leader

EOF
  exit 1
}

check_yq() {
  if ! command -v yq &> /dev/null; then
    echo -e "${RED}Error: yq is not installed${NC}"
    echo "Install with: brew install yq"
    exit 1
  fi
}

check_file() {
  if [[ ! -f "$QUESTION_BANK" ]]; then
    echo -e "${RED}Error: $QUESTION_BANK not found${NC}"
    echo "Run this script from the repository root"
    exit 1
  fi
}

list_questions() {
  echo -e "${BLUE}All Questions:${NC}\n"
  yq '.[] | .id + " | " + .text' "$QUESTION_BANK"
}

list_traits() {
  echo -e "${BLUE}All Traits in Question Bank:${NC}\n"
  grep -E '^\s+[a-z]+-[a-z]+:' "$QUESTION_BANK" | \
    sed 's/:.*//' | \
    sed 's/^[[:space:]]*//' | \
    sort -u | \
    column -c 80
}

show_question() {
  local question_id="$1"
  if [[ -z "$question_id" ]]; then
    echo -e "${RED}Error: Question ID required${NC}"
    exit 1
  fi

  echo -e "${BLUE}Question Details: $question_id${NC}\n"
  yq ".[] | select(.id == \"$question_id\")" "$QUESTION_BANK"
}

find_trait() {
  local trait="$1"
  if [[ -z "$trait" ]]; then
    echo -e "${RED}Error: Trait name required${NC}"
    exit 1
  fi

  echo -e "${BLUE}Questions scoring '$trait':${NC}\n"

  # Find questions containing this trait
  local found=0
  while IFS= read -r question_id; do
    local has_trait=$(yq ".[] | select(.id == \"$question_id\") | .. | select(has(\"$trait\"))" "$QUESTION_BANK" 2>/dev/null)
    if [[ -n "$has_trait" ]]; then
      local text=$(yq ".[] | select(.id == \"$question_id\") | .text" "$QUESTION_BANK")
      echo -e "${GREEN}✓${NC} $question_id"
      echo -e "  ${YELLOW}→${NC} $text"

      # Show which answers have this trait
      for answer in yes maybe no; do
        local score=$(yq ".[] | select(.id == \"$question_id\") | .answers.\"$answer\".\"$trait\" // \"\"" "$QUESTION_BANK")
        if [[ -n "$score" ]]; then
          echo -e "    $answer: $score"
        fi
      done
      echo ""
      found=1
    fi
  done < <(yq '.[].id' "$QUESTION_BANK")

  if [[ $found -eq 0 ]]; then
    echo -e "${YELLOW}No questions found scoring '$trait'${NC}"
  fi
}

add_trait() {
  local question_id="$1"
  local answer="$2"
  local trait="$3"
  local score="$4"

  if [[ -z "$question_id" ]] || [[ -z "$answer" ]] || [[ -z "$trait" ]] || [[ -z "$score" ]]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo "Usage: add-trait <question-id> <answer> <trait> <score>"
    echo "Example: add-trait healing-magic yes protective-value +4"
    exit 1
  fi

  # Validate answer
  if [[ ! "$answer" =~ ^(yes|maybe|no|dont-know)$ ]]; then
    echo -e "${RED}Error: Answer must be one of: yes, maybe, no, dont-know${NC}"
    exit 1
  fi

  # Validate score format
  if [[ ! "$score" =~ ^[+-][0-9]+$ ]]; then
    echo -e "${RED}Error: Score must be in format +N or -N (e.g., +4, -2)${NC}"
    exit 1
  fi

  # Check if question exists
  if ! yq ".[] | select(.id == \"$question_id\")" "$QUESTION_BANK" > /dev/null 2>&1; then
    echo -e "${RED}Error: Question '$question_id' not found${NC}"
    exit 1
  fi

  # Create backup
  cp "$QUESTION_BANK" "${QUESTION_BANK}.bak"
  echo -e "${GREEN}✓${NC} Created backup: ${QUESTION_BANK}.bak"

  # Check if trait already exists
  local existing=$(yq ".[] | select(.id == \"$question_id\") | .answers.\"$answer\".\"$trait\" // \"\"" "$QUESTION_BANK")
  if [[ -n "$existing" ]]; then
    echo -e "${YELLOW}Warning: Trait '$trait' already exists with value: $existing${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Cancelled"
      exit 0
    fi
  fi

  # Add the trait
  yq -i "(.[] | select(.id == \"$question_id\") | .answers.\"$answer\".\"$trait\") = $score" "$QUESTION_BANK"

  echo -e "${GREEN}✓${NC} Added: $trait: $score"
  echo -e "  to question: $question_id"
  echo -e "  in answer: $answer"
  echo ""
  echo -e "${BLUE}Updated question:${NC}"
  yq ".[] | select(.id == \"$question_id\") | .answers.\"$answer\"" "$QUESTION_BANK"
}

suggest_questions() {
  local trait="$1"
  if [[ -z "$trait" ]]; then
    echo -e "${RED}Error: Trait name required${NC}"
    exit 1
  fi

  echo -e "${BLUE}Questions that might be good for '$trait' (searching by keywords):${NC}\n"

  # Extract keywords from trait name (split on -)
  local keywords=$(echo "$trait" | tr '-' '\n' | grep -v "^$")

  # Search question text for these keywords
  while IFS= read -r question_id; do
    local text=$(yq ".[] | select(.id == \"$question_id\") | .text" "$QUESTION_BANK")
    local category=$(yq ".[] | select(.id == \"$question_id\") | .category" "$QUESTION_BANK")

    # Check if any keyword appears in the question text (case insensitive)
    for keyword in $keywords; do
      if echo "$text" | grep -qi "$keyword"; then
        # Check if trait already exists
        local has_trait=$(yq ".[] | select(.id == \"$question_id\") | .. | select(has(\"$trait\"))" "$QUESTION_BANK" 2>/dev/null)
        if [[ -z "$has_trait" ]]; then
          echo -e "${YELLOW}➜${NC} $question_id [$category]"
          echo -e "  $text"
          echo -e "  ${GREEN}Matched keyword: $keyword${NC}"
          echo ""
        fi
        break
      fi
    done
  done < <(yq '.[].id' "$QUESTION_BANK")

  # Also show questions in related categories
  echo -e "${BLUE}Related category suggestions:${NC}\n"
  case "$trait" in
    *-magic)
      local cat="magic-preference"
      ;;
    *-background)
      local cat="character-origin"
      ;;
    *-value)
      local cat="combat-approach"
      ;;
    *specialist|*expert|*master)
      local cat="combat-specialization"
      ;;
    *)
      local cat=""
      ;;
  esac

  if [[ -n "$cat" ]]; then
    echo -e "Category: ${YELLOW}$cat${NC}"
    yq ".[] | select(.category == \"$cat\") | .id + \" | \" + .text" "$QUESTION_BANK"
  fi
}

trait_coverage() {
  local trait="$1"
  if [[ -z "$trait" ]]; then
    echo -e "${RED}Error: Trait name required${NC}"
    exit 1
  fi

  local count=$(grep -c "$trait:" "$QUESTION_BANK" || true)

  echo -e "${BLUE}Coverage for '$trait':${NC}"
  echo -e "  Appears in: ${GREEN}$count${NC} question answer(s)"

  if [[ $count -eq 0 ]]; then
    echo -e "  ${YELLOW}⚠ Warning: This trait has NO question coverage!${NC}"
    echo -e "  ${YELLOW}  Add 2-3 questions that score this trait.${NC}"
  elif [[ $count -lt 2 ]]; then
    echo -e "  ${YELLOW}⚠ Warning: Low coverage (recommended: 2+ questions)${NC}"
  else
    echo -e "  ${GREEN}✓ Good coverage${NC}"
  fi
}

backup() {
  local timestamp=$(date +%Y%m%d_%H%M%S)
  local backup_file="${QUESTION_BANK}.backup_${timestamp}"
  cp "$QUESTION_BANK" "$backup_file"
  echo -e "${GREEN}✓${NC} Backup created: $backup_file"
}

# Main script
check_yq
check_file

case "${1:-}" in
  list-questions)
    list_questions
    ;;
  list-traits)
    list_traits
    ;;
  show-question)
    show_question "$2"
    ;;
  find-trait)
    find_trait "$2"
    ;;
  add-trait)
    add_trait "$2" "$3" "$4" "$5"
    ;;
  suggest-questions)
    suggest_questions "$2"
    ;;
  trait-coverage)
    trait_coverage "$2"
    ;;
  backup)
    backup
    ;;
  *)
    usage
    ;;
esac
