#!/bin/bash
#ls img | xargs -pI{} grep -cr "{}" js/
#ls obj | xargs -pI{} grep -cr "{}" js/
#grep "const" js/grant.js | awk '{print $2}'| xargs -pI{} grep -cr "{}" js/

#for l in `ls img`; do printf "\n$l\n" && ag $l js/ | wc -l; done
#for l in `ls obj`; do printf "\n$l\n" && ag $l js/ | wc -l; done
#for l in `ls obj`; do printf "\n$l\n" && ag $l js/ | wc -l; done

printf "\nSearching for unused OBJs...\n"
for l in `ls obj`; do
  line_count=`ag $l js/ | wc -l`
  if [[ $line_count -eq 0 ]]; then
    printf "\n$l\n";
  fi;
done

printf "\nSearching for unused images...\n"
for l in `ls img`; do
  line_count=`ag $l js/ | wc -l`
  if [[ $line_count -eq 0 ]]; then
    printf "$l\n";
  fi;
done

printf "\nSearching for unused vars...\n"
for l in `grep "\(^\( \+\)\?const \|^\( \+\)\?let \)" js/* | awk '{print $2}'`; do
  line_count=`ag $l js/ | wc -l`
  if [[ $line_count -eq 1 ]]; then
    printf "$l\n";
  fi;
done

printf "\nSearching for barely used vars...\n"
for l in `grep "\(^\( \+\)\?const \|^\( \+\)\?let \)" js/* | awk '{print $2}'`; do
  line_count=`ag $l js/ | wc -l`
  if [[ $line_count -eq 2 ]]; then
    printf "$l\n";
  fi;
done
