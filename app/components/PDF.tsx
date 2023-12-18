/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document as PDFDocument,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Message } from "ai";
import { Sources } from "../types";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "work-sans",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  subheader: {
    marginBottom: 12,
    marginTop: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "work-sans",
    fontWeight: "bold",
  },
  sources: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "work-sans",
  },
  assistant: {
    fontSize: 12,
    marginBottom: 8,
    padding: 6,
    backgroundColor: "white",
    border: "1px solid black",
    color: "black",
  },
  user: {
    fontSize: 12,
    marginBottom: 8,
    padding: 6,
    backgroundColor: "white",
    border: "1px solid black",
    color: "black",
  },
});

type PDFProps = {
  messages: Message[];
  sources: Sources;
};

export const PDF = ({ messages, sources }: PDFProps) => {
  const date = new Date().toLocaleDateString("en-GB");
  return (
    <PDFDocument title={"AIDUS_Conversation_" + date}>
      <Page size="A4" style={styles.body}>
        <View style={styles.header}>
          <Image src="./UCARE_Logo.png" style={{ width: 98, height: 41 }} />
          <Text style={styles.title}>Chat with AIDUS on {date}</Text>
        </View>
        <View>
          {messages.map((message, index) => {
            if (message.role === "user") {
              return (
                <View key={index}>
                  <Text
                    style={{
                      ...styles.user,
                      marginBottom: -6,
                      fontWeight: "bold",
                    }}
                  >
                    You
                  </Text>
                  <Text style={styles.user}>{message.content}</Text>
                </View>
              );
            } else {
              return (
                <View key={index}>
                  <Text
                    style={{
                      ...styles.assistant,
                      marginBottom: -6,
                      fontWeight: "bold",
                    }}
                  >
                    AIDUS
                  </Text>
                  <Text style={styles.assistant}>{message.content}</Text>
                </View>
              );
            }
          })}
        </View>
        {sources && sources.length > 0 ? (
          <View>
            <Text style={styles.subheader}>
              Sources referenced in this conversation:
            </Text>
            {sources.map((sourceCluster, index) =>
              sourceCluster.sources.map((source, index) => (
                <View
                  style={{ marginBottom: 12 }}
                  key={source.metadata.pdf.info.Author + index}
                >
                  <Text
                    style={{ ...styles.sources, fontStyle: "italic" }}
                    key={index}
                  >
                    {source.metadata.pdf.info.Title ?? "MISSING TITLE"}
                  </Text>
                  <Text style={{ ...styles.sources, fontSize: 11 }} key={index}>
                    {source.metadata.pdf.info.Author ?? "MISSING AUTHOR"}, p.{" "}
                    {source.metadata.loc.pageNumber}
                  </Text>
                </View>
              )),
            )}
          </View>
        ) : null}
      </Page>
    </PDFDocument>
  );
};

Font.register({
  family: "work-sans",
  fonts: [
    { src: "./WorkSans-Regular.ttf" },
    { src: "./WorkSans-Bold.ttf", fontWeight: "bold" },
    { src: "./WorkSans-Italic.ttf", fontStyle: "italic" },
  ],
});
